import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPromotionDto: CreatePromotionDto, sellerId: string) {
    // 1. Desestruturando os dados do DTO
    const {
      startTime,
      endTime,
      originalPrice,
      promoPrice,
      stock,
      limitPerUser,
      ...rest
    } = createPromotionDto;

    const dataInicio = new Date(startTime);
    const dataFim = new Date(endTime);
    const agora = new Date();

    // 🛑 REGRA 1 & 2: Validações de Valores (Preços válidos e desconto real)
    if (originalPrice <= 0 || promoPrice <= 0) {
      throw new BadRequestException(
        'Os preços original e promocional devem ser maiores que zero.',
      );
    }

    if (promoPrice >= originalPrice) {
      throw new BadRequestException(
        'O preço promocional deve ser menor do que o preço original.',
      );
    }

    // 🛑 REGRA 3 & 4: Validações de Cronograma (Lógica do relógio)
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

    // 🛑 REGRA 5: Lógica de Estoque vs Limite por Usuário (Considerando o 0 como ilimitado)
    if (limitPerUser > 0 && limitPerUser > stock) {
      throw new BadRequestException(
        'O limite de resgate por usuário não pode ser maior do que o estoque total disponível.',
      );
    }

    // -------------------------------------------------------------------------
    // Passou em todas as travas do MVP? Salva no banco de dados com segurança!
    // -------------------------------------------------------------------------
    try {
      const promotion = await this.prisma.promotion.create({
        data: {
          ...rest,
          stock,
          limitPerUser,
          originalPrice,
          promoPrice,
          startTime: dataInicio,
          endTime: dataFim,
          sellerId: sellerId, // Vinculado automaticamente pelo token do Seller
        },
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
        isActive: true, // Só o que o lojista não desativou
        stock: { gte: 1 }, // Só o que tem 1 ou mais unidades no estoque
        startTime: { lte: agora }, // Onde a data de início já passou ou é agora
        endTime: { gte: agora }, // Onde a data de término ainda não chegou
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
        // 🏪 Traz os dados da loja para renderizar no card do feed
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Novidades aparecem primeiro no topo do feed
      },
    });
  }
  async findOne(id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            address: true,
            businessHours: true,
          },
        },
      },
    });
  
    if (!promotion) {
      throw new BadRequestException('Promoção não encontrada.');
    }
  
    return promotion;
  }

  async update(
    id: string,
    sellerId: string,
    updatePromotionDto: UpdatePromotionDto,
  ) {
    // 1. Busca a promoção existente e garante que ela pertence ao vendedor logado
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

    // 2. Mescla os dados atuais do banco com os novos dados que vieram no DTO
    // Se o campo veio no DTO, usa o novo. Se não veio, mantém o que já estava no banco.
    const originalPrice =
      updatePromotionDto.originalPrice ?? promotion.originalPrice;
    const promoPrice = updatePromotionDto.promoPrice ?? promotion.promoPrice;
    const stock = updatePromotionDto.stock ?? promotion.stock;
    const limitPerUser =
      updatePromotionDto.limitPerUser ?? promotion.limitPerUser;

    const dataInicio = updatePromotionDto.startTime
      ? new Date(updatePromotionDto.startTime)
      : promotion.startTime;
    const dataFim = updatePromotionDto.endTime
      ? new Date(updatePromotionDto.endTime)
      : promotion.endTime;
    const agora = new Date();

    // 🛑 APLICANDO AS MESMAS 5 REGRAS DE NEGÓCIO

    // Regra 1 & 2: Validações de Valores
    if (originalPrice <= 0 || promoPrice <= 0) {
      throw new BadRequestException(
        'Os preços original e promocional devem ser maiores que zero.',
      );
    }

    if (promoPrice >= originalPrice) {
      throw new BadRequestException(
        'O preço promocional deve ser menor do que o preço original.',
      );
    }

    // Regra 3 & 4: Validações de Cronograma
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

    // Regra 5: Estoque vs Limite por Usuário
    if (limitPerUser > 0 && limitPerUser > stock) {
      throw new BadRequestException(
        'O limite de resgate por usuário não pode ser maior do que o estoque total disponível.',
      );
    }

    // 3. Tudo validado? Agora isolamos as datas do resto do DTO para atualizar
    const { startTime, endTime, ...rest } = updatePromotionDto;

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

  async remove(id: string, sellerId: string) {
    // 1. Busca a promoção para verificar se ela existe e se pertence ao vendedor
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      throw new BadRequestException('Promoção não encontrada.');
    }

    if (promotion.sellerId !== sellerId) {
      throw new BadRequestException(
        'Você não tem permissão para remover esta promoção.',
      );
    }

    try {
      // 2. Faz o Soft Delete desativando a promoção
      await this.prisma.promotion.update({
        where: { id },
        data: { isActive: false },
      });

      return { message: 'Promoção removida com sucesso do feed.' };
    } catch (error) {
      console.error('🚨 ERRO AO REMOVER PROMOÇÃO:', error);
      throw new HttpException(
        'Erro interno ao tentar remover a promoção.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
