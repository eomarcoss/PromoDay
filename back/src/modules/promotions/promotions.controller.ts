// src/promotions/promotions.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseInterceptors,
  UploadedFiles,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  Delete,
  Patch,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto'; // Ajuste o caminho do seu DTO
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  // POST /promotions (Criação de promoção com upload de até 3 imagens)
  // @UseGuards(JwtAuthGuard) // Descomente para proteger a rota com JWT

  @Post()
  @UseInterceptors(FilesInterceptor('files', 3)) // Permite até 3 arquivos vindo da chave "files"
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createPromotionDto: CreatePromotionDto,
    @Req() req: any,
  ) {
    const sellerId = req.user.sub;

    return this.promotionsService.create(createPromotionDto, sellerId, files);
  }

  // GET /promotions (Feed público)
  @Get()
  async getFeed() {
    return this.promotionsService.findAllActive();
  }

  // GET /promotions/:id (Detalhes públicos de uma promoção)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.sub;
    return this.promotionsService.findOne(id, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req: any) {
    const sellerId = req.user?.sub;
    return this.promotionsService.remove(id, sellerId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/pause')
  @HttpCode(HttpStatus.OK)
  async toggleActive(@Param('id') id: string, @Req() req: any) {
    const sellerId = req.user.sub || req.user.id || req.user.sellerId;

    return this.promotionsService.toggleActive(id, sellerId);
  }
}
