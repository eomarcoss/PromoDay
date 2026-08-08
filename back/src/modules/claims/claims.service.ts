import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { generateClaimCode } from 'src/utils/generate-code';

@Injectable()
export class ClaimsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 1. RESGATAR PROMOÇÃO (Cliente)
   */
  async claimPromotion(customerId: string, promotionId: string) {
    // 1. Busca a promoção para validar estoque e datas
    const promotion = await this.prisma.promotion.findUnique({
      where: { id: promotionId },
    });

    if (!promotion || !promotion.isActive) {
      throw new NotFoundException('Promoção indisponível ou não encontrada.');
    }

    const now = new Date();
    if (now < promotion.startTime || now > promotion.endTime) {
      throw new BadRequestException('Esta promoção não está ativa no momento.');
    }

    if (promotion.stock <= 0) {
      throw new BadRequestException('Estoque desta promoção esgotado.');
    }

    // 2. Verifica se o cliente já possui um resgate pendente para esta promoção
    const existingClaim = await this.prisma.claim.findUnique({
      where: {
        customerId_promotionId: {
          customerId,
          promotionId,
        },
      },
      include: {
        promotion: {
          select: { name: true, promoPrice: true, images: true },
        },
      },
    });

    // Se já resgatou e o cupom está PENDING, devolve o mesmo cupom existente
    if (existingClaim) {
      if (existingClaim.status === 'PENDING') {
        return existingClaim;
      }
      throw new ConflictException('Você já utilizou o cupom desta promoção.');
    }

    // 3. Gera código único e cria o registro do resgate
    let code = generateClaimCode();
    let isCodeUnique = false;
    let attempts = 0;

    // Garante unicidade do código em caso de colisão raríssima
    while (!isCodeUnique && attempts < 5) {
      const codeExists = await this.prisma.claim.findUnique({
        where: { code },
      });
      if (!codeExists) {
        isCodeUnique = true;
      } else {
        code = generateClaimCode();
        attempts++;
      }
    }

    return await this.prisma.claim.create({
      data: {
        code,
        customerId,
        promotionId,
        status: 'PENDING',
      },
      include: {
        promotion: {
          select: { name: true, promoPrice: true, images: true },
        },
      },
    });
  }

  /**
   * 2. VALIDAR CUPOM NO BALCÃO (Vendedor)
   */
  async validateClaim(sellerId: string, code: string) {
    // Transação do Prisma para garantir consistência entre atualizar o cupom e dar baixa no estoque
    return await this.prisma.$transaction(async (tx) => {
      const claim = await tx.claim.findUnique({
        where: { code: code.toUpperCase() },
        include: {
          promotion: true,
          customer: { select: { id: true, name: true, email: true } },
        },
      });

      if (!claim) {
        throw new NotFoundException('Código de cupom não encontrado.');
      }

      // Valida se a promoção pertence à loja logada
      if (claim.promotion.sellerId !== sellerId) {
        throw new ForbiddenException('Este cupom pertence a outra loja.');
      }

      // Valida status do cupom
      if (claim.status === 'USED') {
        throw new BadRequestException(
          'Este cupom já foi utilizado anteriormente.',
        );
      }

      if (claim.status !== 'PENDING') {
        throw new BadRequestException('Este cupom não está mais disponível.');
      }

      // Valida estoque no momento da validação
      if (claim.promotion.stock < claim.quantity) {
        throw new BadRequestException(
          'Estoque insuficiente para validar esta oferta.',
        );
      }

      // 1. Atualiza o status do resgate para USED
      const updatedClaim = await tx.claim.update({
        where: { id: claim.id },
        data: {
          status: 'USED',
          usedAt: new Date(),
        },
        include: {
          customer: { select: { name: true } },
          promotion: { select: { name: true, promoPrice: true } },
        },
      });

      // 2. Decrementa o estoque da promoção
      await tx.promotion.update({
        where: { id: claim.promotionId },
        data: {
          stock: { decrement: claim.quantity },
        },
      });

      return updatedClaim;
    });
  }

  /**
   * 3. LISTAR MEUS RESGATES (Cliente)
   */
  async getCustomerClaims(customerId: string) {
    return await this.prisma.claim.findMany({
      where: { customerId },
      include: {
        promotion: {
          include: {
            seller: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
