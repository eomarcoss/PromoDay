import { Module } from '@nestjs/common';
import { CostomersService } from './costomers.service';
import { CostomersController } from './costomers.controller';
import { PrismaService } from 'prisma/prisma.service';
import { StorageService } from 'src/shared/storage.service';

@Module({
  controllers: [CostomersController],
  providers: [CostomersService, PrismaService, StorageService],
})
export class CostomersModule {}
