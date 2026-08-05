import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Request,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { StorageService } from 'src/shared/storage.service';

@Controller('promotions')
export class PromotionsController {
  constructor(
    private readonly promotionsService: PromotionsService,
    private readonly storageService: StorageService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async create(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File, // 👈 Injeção do arquivo
    @Body() createPromotionDto: CreatePromotionDto,
  ) {
    const sellerId = req.user.sub;
    const imageUrls: string[] = [];

    // 1. Faz upload do arquivo se ele estiver presente
    if (file) {
      const publicUrl = await this.storageService.uploadFile(file, 'Avatars');
      imageUrls.push(publicUrl);
    }

    // 2. Unifica o DTO com as URLs de imagem tratadas
    return this.promotionsService.create(
      {
        ...createPromotionDto,
        images: imageUrls,
      },
      sellerId,
    );
  }

  @Get()
  async getFeed() {
    return this.promotionsService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ) {
    const sellerId = req.user.sub;
    return this.promotionsService.update(id, sellerId, updatePromotionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const sellerId = req.user.sub;
    return this.promotionsService.remove(id, sellerId);
  }
}
