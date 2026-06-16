import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPromotionDto: CreatePromotionDto, sellerId: string) {
    try {
      // 1. Desestruturamos as datas para convertê-las adequadamente
      const { startTime, endTime, ...rest } = createPromotionDto;

      // 2. Criamos a promoção vinculando ao sellerId do token
      const promotion = await this.prisma.promotion.create({
        data: {
          ...rest,
          startTime: new Date(startTime), // Conversão necessária para o Prisma armazenar como DateTime
          endTime: new Date(endTime), // Conversão necessária para o Prisma armazenar como DateTime
          sellerId: sellerId, // Vincula a promoção ao vendedor logado
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

  findAll() {
    return `This action returns all promotions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} promotion`;
  }

  update(id: number, updatePromotionDto: UpdatePromotionDto) {
    return `This action updates a #${id} promotion`;
  }

  remove(id: number) {
    return `This action removes a #${id} promotion`;
  }
}
