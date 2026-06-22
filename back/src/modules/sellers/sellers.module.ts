import { Module } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { SellersController } from './sellers.controller';
import { PrismaService } from 'prisma/prisma.service';
import { StorageService } from 'src/shared/storage.service';

@Module({
  controllers: [SellersController],
  providers: [SellersService, PrismaService, StorageService],
  exports: [SellersService],
})
export class SellersModule {}
