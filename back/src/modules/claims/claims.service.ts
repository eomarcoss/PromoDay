import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { generateClaimCode } from 'src/utils/generate-code';

export interface ExecuteClaimInput {
  userId: string;
  promotionId: string;
  quantity?: number;
}

@Injectable()
export class ClaimsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 1. RESGATAR PROMOÇÃO (Cliente)
   * Alias 'execute' para manter compatibilidade com a chamada do Controller
   */
  async execute({
    userId,
    promotionId,
    quantity = 1,
  }: {
    userId: string;
    promotionId: string;
    quantity: number;
  }) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Busca a promoção
      const promotion = await tx.promotion.findUnique({
        where: { id: promotionId },
      });

      if (!promotion) {
        throw new NotFoundException('Promoção não encontrada.');
      }

      // 2. Valida estoque geral
      if (promotion.stock < quantity) {
        throw new BadRequestException(
          `Estoque insuficiente. Restam apenas ${promotion.stock} unidade(s).`,
        );
      }

      // 3. Valida limite por usuário baseado no ACUMULADO (usando limitPerUser e tx.claim)
      if (promotion.limitPerUser > 0) {
        const userClaimsAggregate = await tx.claim.aggregate({
          where: {
            customerId: userId,
            promotionId: promotionId,
            status: { not: 'CANCELLED' },
          },
          _sum: {
            quantity: true,
          },
        });

        const totalAlreadyRedeemed = userClaimsAggregate._sum.quantity || 0;

        if (totalAlreadyRedeemed + quantity > promotion.limitPerUser) {
          const remainingAllowed = Math.max(
            0,
            promotion.limitPerUser - totalAlreadyRedeemed,
          );
          throw new BadRequestException(
            `Limite de resgates excedido. Você já resgatou ${totalAlreadyRedeemed} unidade(s). Restam ${remainingAllowed} disponíveis.`,
          );
        }
      }

      // 4. Gera um novo código único para este cupom

      const code = generateClaimCode();

      // 5. CRIA UM NOVO REGISTRO na tabela claim
      const newClaim = await tx.claim.create({
        data: {
          customerId: userId,
          promotionId: promotionId,
          quantity: quantity,
          code: code,
          status: 'PENDING',
        },
        include: {
          promotion: {
            select: {
              name: true,
              promoPrice: true,
              images: true,
            },
          },
        },
      });

      // 6. Atualiza e abate o estoque geral
      await tx.promotion.update({
        where: { id: promotionId },
        data: {
          stock: {
            decrement: quantity,
          },
        },
      });

      return newClaim;
    });
  }

  async claimPromotion(
    customerId: string,
    promotionId: string,
    quantity: number = 1,
  ) {
    return this.execute({ userId: customerId, promotionId, quantity });
  }

  /**
   * 2. VALIDAR CUPOM NO BALCÃO (Vendedor)
   */
  async validateClaim(sellerId: string, code: string) {
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

      if (claim.promotion.sellerId !== sellerId) {
        throw new ForbiddenException('Este cupom pertence a outra loja.');
      }

      if (claim.status === 'USED') {
        throw new BadRequestException(
          'Este cupom já foi utilizado anteriormente.',
        );
      }

      if (claim.status !== 'PENDING') {
        throw new BadRequestException('Este cupom não está mais disponível.');
      }

      return await tx.claim.update({
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

  async getUserRedeemedQuantityByPromotion(
    promotionId: string,
    userId: string,
  ): Promise<number> {
    const result = await this.prisma.claim.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        promotionId: promotionId,
        customerId: userId, // 👈 Filtra também pelo ID do cliente
        status: {
          not: 'CANCELLED',
        },
      },
    });

    return result._sum.quantity ?? 0;
  }
}
