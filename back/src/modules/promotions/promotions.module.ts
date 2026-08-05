import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { PrismaService } from 'prisma/prisma.service';
import { StorageService } from 'src/shared/storage.service';

@Module({
  controllers: [PromotionsController],
  providers: [PromotionsService, PrismaService, StorageService],
})
export class PromotionsModule {}
