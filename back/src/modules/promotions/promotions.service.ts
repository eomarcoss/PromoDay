import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PrismaService } from 'prisma/prisma.service';
import { StorageService } from 'src/shared/storage.service';

@Injectable()
export class PromotionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async create(
    createPromotionDto: CreatePromotionDto,
    sellerId: string,
    files?: Express.Multer.File[],
  ) {
    const seller = await this.prisma.seller.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new BadRequestException(
        'Perfil de vendedor não encontrado para este usuário.',
      );
    }

    let imageUrls: string[] = [];
    if (files && files.length > 0) {
      imageUrls = await this.storageService.uploadManyFiles(files);
    }

    const {
      startTime,
      endTime,
      originalPrice,
      promoPrice,
      stock,
      limitPerUser,
      images,
      ...rest
    } = createPromotionDto;

    const numOriginalPrice = Number(originalPrice);
    const numPromoPrice = Number(promoPrice);
    const numStock = Number(stock);
    const numLimitPerUser = Number(limitPerUser);

    const dataInicio = new Date(startTime);
    const dataFim = new Date(endTime);
    const agora = new Date();

    if (
      isNaN(numOriginalPrice) ||
      isNaN(numPromoPrice) ||
      numOriginalPrice <= 0 ||
      numPromoPrice <= 0
    ) {
      throw new BadRequestException(
        'Os preços original e promocional devem ser números válidos maiores que zero.',
      );
    }

    if (numPromoPrice >= numOriginalPrice) {
      throw new BadRequestException(
        'O preço promocional deve ser menor do que o preço original.',
      );
    }

    if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
      throw new BadRequestException('Formato de data inválido.');
    }

    if (dataInicio >= dataFim) {
      throw new BadRequestException(
        'A data de início não pode ser maior ou igual à data de término.',
      );
    }

    if (dataFim <= agora) {
      throw new BadRequestException(
        'A data de término da promoção deve ser em uma data futura.',
      );
    }

    if (isNaN(numStock) || isNaN(numLimitPerUser)) {
      throw new BadRequestException(
        'Estoque e limite por usuário devem ser números válidos.',
      );
    }

    if (numLimitPerUser > 0 && numLimitPerUser > numStock) {
      throw new BadRequestException(
        'O limite de resgate por usuário não pode ser maior do que o estoque total disponível.',
      );
    }

    const finalImages = imageUrls.length > 0 ? imageUrls : images || [];

    try {
      const promotion = await this.prisma.$transaction(async (tx) => {
        // 1. Cria a promoção usando o contexto da transação (tx)
        const newPromotion = await tx.promotion.create({
          data: {
            ...rest,
            stock: numStock,
            limitPerUser: numLimitPerUser,
            originalPrice: numOriginalPrice,
            promoPrice: numPromoPrice,
            startTime: dataInicio,
            endTime: dataFim,
            images: finalImages,
            sellerId: sellerId,
          },
        });

        // 2. Incremente o totalPromotions do Seller em +1
        await tx.seller.update({
          where: { id: sellerId },
          data: {
            totalPromotions: {
              increment: 1,
            },
          },
        });

        return newPromotion;
      });

      return promotion;
    } catch (error) {
      console.error('🚨 ERRO AO CRIAR PROMOÇÃO:', error);
      throw new HttpException(
        'Erro interno ao tentar criar a promoção.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllActive() {
    const agora = new Date();

    return this.prisma.promotion.findMany({
      where: {
        isActive: true,
        stock: { gte: 1 },
        startTime: { lte: agora },
        endTime: { gte: agora },
      },
      select: {
        id: true,
        name: true,
        images: true,
        originalPrice: true,
        promoPrice: true,
        stock: true,
        limitPerUser: true,
        endTime: true,
        seller: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAllBySeller(sellerId: string) {
    return this.prisma.promotion.findMany({
      where: {
        sellerId: sellerId,
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // promotions.service.ts

  async findOne(id: string, userId?: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            address: true,
            businessHours: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!promotion) {
      throw new BadRequestException('Promoção não encontrada.');
    }

    let userRedeemedCount = 0;

    if (userId) {
      try {
        // 1. Busca a soma das quantidades (se a model usa campo quantity)
        const aggregate = await this.prisma.claim.aggregate({
          where: {
            customerId: userId,
            promotionId: id,
            status: { notIn: ['CANCELLED', 'EXPIRED'] }, // Ignora apenas cancelados/expirados
          },
          _sum: {
            quantity: true,
          },
        });

        // 2. Se a soma for null (campos quantity não preenchidos), faz o count dos registros
        if (
          aggregate._sum?.quantity !== null &&
          aggregate._sum?.quantity !== undefined
        ) {
          userRedeemedCount = aggregate._sum.quantity;
        } else {
          userRedeemedCount = await this.prisma.claim.count({
            where: {
              customerId: userId,
              promotionId: id,
              status: { notIn: ['CANCELLED', 'EXPIRED'] },
            },
          });
        }
      } catch (err) {
        console.error('🚨 Erro ao calcular resgates do usuário:', err);
        userRedeemedCount = 0;
      }
    }

    return {
      ...promotion,
      userRedeemedCount,
    };
  }
  async update(
    id: string,
    sellerId: string,
    updatePromotionDto: UpdatePromotionDto,
  ) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      throw new BadRequestException('Promoção não encontrada.');
    }

    if (promotion.sellerId !== sellerId) {
      throw new BadRequestException(
        'Você não tem permissão para alterar esta promoção.',
      );
    }

    const originalPrice =
      updatePromotionDto.originalPrice !== undefined
        ? Number(updatePromotionDto.originalPrice)
        : promotion.originalPrice;

    const promoPrice =
      updatePromotionDto.promoPrice !== undefined
        ? Number(updatePromotionDto.promoPrice)
        : promotion.promoPrice;

    const stock =
      updatePromotionDto.stock !== undefined
        ? Number(updatePromotionDto.stock)
        : promotion.stock;

    const limitPerUser =
      updatePromotionDto.limitPerUser !== undefined
        ? Number(updatePromotionDto.limitPerUser)
        : promotion.limitPerUser;

    const dataInicio = updatePromotionDto.startTime
      ? new Date(updatePromotionDto.startTime)
      : promotion.startTime;

    const dataFim = updatePromotionDto.endTime
      ? new Date(updatePromotionDto.endTime)
      : promotion.endTime;

    const agora = new Date();

    if (Number(originalPrice) <= 0 || Number(promoPrice) <= 0) {
      throw new BadRequestException(
        'Os preços original e promocional devem ser maiores que zero.',
      );
    }

    if (Number(promoPrice) >= Number(originalPrice)) {
      throw new BadRequestException(
        'O preço promocional deve ser menor do que o preço original.',
      );
    }

    if (dataInicio >= dataFim) {
      throw new BadRequestException(
        'A data de início não pode ser maior ou igual à data de término.',
      );
    }

    if (dataFim <= agora) {
      throw new BadRequestException(
        'A data de término da promoção deve ser em uma data futura.',
      );
    }

    if (limitPerUser > 0 && limitPerUser > stock) {
      throw new BadRequestException(
        'O limite de resgate por usuário não pode ser maior do que o estoque total disponível.',
      );
    }

    // Isola os campos tratados para evitar sobrescrever com strings soltas do DTO
    const {
      startTime,
      endTime,
      originalPrice: _,
      promoPrice: __,
      stock: ___,
      limitPerUser: ____,
      ...rest
    } = updatePromotionDto;

    try {
      const updatedPromotion = await this.prisma.promotion.update({
        where: { id },
        data: {
          ...rest,
          stock,
          limitPerUser,
          originalPrice,
          promoPrice,
          startTime: dataInicio,
          endTime: dataFim,
        },
      });

      return updatedPromotion;
    } catch (error) {
      console.error('🚨 ERRO AO ATUALIZAR PROMOÇÃO:', error);
      throw new HttpException(
        'Erro interno ao tentar atualizar a promoção.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async toggleActive(id: string, sellerId: string) {
    if (!id || !sellerId) {
      throw new BadRequestException(
        'IDs do vendedor e da promoção são obrigatórios.',
      );
    }

    // 1. Busca a promoção existente
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundException('Promoção não encontrada.');
    }

    // 2. Garante que apenas o próprio vendedor dono da promoção pode alterá-la
    if (promotion.sellerId !== sellerId) {
      throw new ForbiddenException(
        'Você não tem permissão para alterar o status desta promoção.',
      );
    }

    // 3. Atualiza invertendo o estado atual do isActive (true <-> false)
    const updatedPromotion = await this.prisma.promotion.update({
      where: { id },
      data: {
        isActive: !promotion.isActive,
      },
    });

    return {
      message: `Promoção ${updatedPromotion.isActive ? 'ativada' : 'pausada'} com sucesso.`,
      isActive: updatedPromotion.isActive,
      promotion: updatedPromotion,
    };
  }

  async remove(id: string, sellerId: string) {
    // 1. Busca a promoção para validar existência e permissão
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundException('Promoção não encontrada.');
    }

    if (promotion.sellerId !== sellerId) {
      throw new BadRequestException(
        'Você não tem permissão para remover esta promoção.',
      );
    }

    // 2. Transação atômica para deletar a promoção e decrementar o contador do Seller
    await this.prisma.$transaction(async (tx) => {
      await tx.promotion.delete({
        where: { id },
      });

      await tx.seller.update({
        where: { id: sellerId },
        data: {
          totalPromotions: {
            decrement: 1,
          },
        },
      });
    });

    return { message: 'Promoção excluída com sucesso' };
  }
}
