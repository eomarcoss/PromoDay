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
} from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @UseGuards(JwtAuthGuard) // 🔒 Apenas vendedores logados criam promoções
  @Post() // POST /promotions
  create(@Request() req: any, @Body() createPromotionDto: CreatePromotionDto) {
    // Pegamos o ID do vendedor direto do token
    const sellerId = req.user.sub;

    // Passamos os dados da promoção e o ID do dono para o Service
    return this.promotionsService.create(createPromotionDto, sellerId);
  }

  @Get() // 👈 GET /promotions
  async getFeed() {
    return this.promotionsService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id') // PATCH /promotions/:id
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ) {
    const sellerId = req.user.sub; // Garante a identidade do lojista
    return this.promotionsService.update(id, sellerId, updatePromotionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id') // DELETE /promotions/:id
  remove(@Param('id') id: string, @Request() req: any) {
    const sellerId = req.user.sub; // ID do lojista logado
    return this.promotionsService.remove(id, sellerId);
  }
}
