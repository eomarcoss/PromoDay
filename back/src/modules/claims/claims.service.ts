import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateClaimDto } from './dto/create-claim.dto';
import { PrismaService } from 'prisma/prisma.service';
@Injectable()
export class ClaimsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClaimDto: CreateClaimDto, customerId: string) {
    const { promotionId, quantity } = createClaimDto; // 👈 Pegamos a quantidade aqui
    const agora = new Date();

    // 1. Busca a promoção e faz validações básicas
    const promotion = await this.prisma.promotion.findUnique({
      where: { id: promotionId },
    });

    if (!promotion || !promotion.isActive) {
      throw new BadRequestException('Esta promoção não está mais disponível.');
    }

    if (agora < promotion.startTime || agora > promotion.endTime) {
      throw new BadRequestException('Esta promoção não está ativa no momento.');
    }

    // 🛑 TRAVA 1: Estoque suficiente para a quantidade desejada
    if (promotion.stock < quantity) {
      throw new BadRequestException(
        `Estoque insuficiente. Restam apenas ${promotion.stock} unidades disponíveis.`,
      );
    }

    // 2. Busca se o usuário já possui um resgate PENDING para este produto
    const claimExistente = await this.prisma.claim.findUnique({
      where: {
        customerId_promotionId: { customerId, promotionId },
      },
    });

    if (claimExistente && claimExistente.status === 'USED') {
      throw new BadRequestException(
        'Você já retirou este produto na loja física.',
      );
    }

    // 🛑 TRAVA 2: Limite por usuário considerando a quantidade nova + o que já foi resgatado
    const quantidadeJaResgatada = claimExistente ? claimExistente.quantity : 0;
    if (
      promotion.limitPerUser > 0 &&
      quantidadeJaResgatada + quantity > promotion.limitPerUser
    ) {
      const limiteDisponivel = promotion.limitPerUser - quantidadeJaResgatada;
      throw new BadRequestException(
        `Você já resgatou ${quantidadeJaResgatada} unidades. O limite máximo é de ${promotion.limitPerUser}, logo você só pode resgatar mais ${limiteDisponivel} unidade(s).`,
      );
    }

    // 🔄 TRANSAÇÃO PRISMA: Deduz o estoque e cria/atualiza o cupom
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Decrementa a quantidade exata do estoque global
        await tx.promotion.update({
          where: { id: promotionId },
          data: { stock: { decrement: quantity } }, // 👈 Decrementa dinamicamente
        });

        if (claimExistente) {
          // CENÁRIO A: O cliente já tinha o código. Incrementa a quantidade enviada
          const claimAtualizado = await tx.claim.update({
            where: { id: claimExistente.id },
            data: { quantity: { increment: quantity } }, // 👈 Incrementa dinamicamente
            include: {
              promotion: { select: { name: true, promoPrice: true } },
            },
          });

          return {
            message: `${quantity} unidade(s) adicionada(s) ao seu código de resgate existente!`,
            claim: claimAtualizado,
          };
        } else {
          // CENÁRIO B: Primeiro resgate. Gera o código com a quantidade do seletor
          const code = this.gerarCodigoCupom();
          const novoClaim = await tx.claim.create({
            data: {
              code,
              customerId,
              promotionId,
              quantity, // 👈 Salva com a quantidade inicial do seletor
            },
            include: {
              promotion: { select: { name: true, promoPrice: true } },
            },
          });

          return {
            message: 'Cupom gerado com sucesso! Apresente o código no balcão.',
            claim: novoClaim,
          };
        }
      });
    } catch (error) {
      console.error('🚨 ERRO AO PROCESSAR RESGATE ACUMULADO:', error);
      throw new HttpException(
        'Erro ao processar o resgate.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private gerarCodigoCupom(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let resultado = 'PD-';
    for (let i = 0; i < 5; i++) {
      resultado += caracteres.charAt(
        Math.floor(Math.random() * caracteres.length),
      );
    }
    return resultado;
  }
}
