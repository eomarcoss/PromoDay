// src/promotions/seller-promotions.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { StorageService } from 'src/shared/storage.service';

@Controller('seller/promotions') // 🚀 Rota base: /seller/promotions
@UseGuards(JwtAuthGuard) // Guard aplicado para toda a classe
export class SellerPromotionsController {
  constructor(
    private readonly promotionsService: PromotionsService,
    private readonly storageService: StorageService,
  ) {}

  // GET /seller/promotions
  @Get()
  async findSellerPromotions(@Request() req: any) {
    const sellerId = req.user.sub;

    if (!sellerId) {
      throw new BadRequestException('ID do vendedor ausente no token.');
    }

    return this.promotionsService.findAllBySeller(sellerId);
  }

  // POST /seller/promotions
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() createPromotionDto: CreatePromotionDto,
  ) {
    const sellerId = req.user.sub;
    const imageUrls: string[] = [];

    if (file) {
      const publicUrl = await this.storageService.uploadFile(file, 'Avatars');
      imageUrls.push(publicUrl);
    }

    return this.promotionsService.create(
      { ...createPromotionDto, images: imageUrls },
      sellerId,
    );
  }

  // PATCH /seller/promotions/:id
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ) {
    return this.promotionsService.update(id, req.user.sub, updatePromotionDto);
  }

  // DELETE /seller/promotions/:id
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.promotionsService.remove(id, req.user.sub);
  }
}
