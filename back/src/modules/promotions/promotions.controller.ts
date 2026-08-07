// src/promotions/promotions.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { PromotionsService } from './promotions.service';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  // GET /promotions (Feed público)
  @Get()
  async getFeed() {
    return this.promotionsService.findAllActive();
  }

  // GET /promotions/:id (Detalhes públicos de uma promoção)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(id);
  }
}
