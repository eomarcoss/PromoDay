import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { PrismaService } from 'prisma/prisma.service';
import { StorageService } from 'src/shared/storage.service';
import { SellerPromotionsController } from './seller-promotions.controller';

@Module({
  controllers: [PromotionsController, SellerPromotionsController],
  providers: [PromotionsService, PrismaService, StorageService],
})
export class PromotionsModule {}
