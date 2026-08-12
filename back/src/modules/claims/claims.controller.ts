import {
  Controller,
  Post,
  Patch,
  Get,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { ValidateClaimDto } from './dto/create-claim.dto';
import { ClaimPromotionDto } from './dto/claim-promotion.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/decorators/roles.decorator';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post('/promotions/:id/redeem')
  @Roles('CUSTOMER')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id') promotionId: string,
    @Body() dto: ClaimPromotionDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    const quantity = Number(dto?.quantity) > 0 ? Number(dto.quantity) : 1;

    return await this.claimsService.execute({
      userId,
      promotionId,
      quantity,
    });
  }

  @Post('redeems')
  @Roles('CUSTOMER')
  @HttpCode(HttpStatus.CREATED)
  async createFromRedeemsRoute(
    @Body() dto: { promotionId: string; quantity?: number },
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    const quantity = Number(dto?.quantity) > 0 ? Number(dto.quantity) : 1;

    return await this.claimsService.execute({
      userId,
      promotionId: dto.promotionId,
      quantity,
    });
  }

  @Patch('seller/claims/validate')
  @Roles('SELLER')
  @HttpCode(HttpStatus.OK)
  async validateClaim(@Req() req: any, @Body() dto: ValidateClaimDto) {
    const sellerId = req.user.sub;
    return await this.claimsService.validateClaim(sellerId, dto.code);
  }

  @Get('redeems')
  @Roles('CUSTOMER')
  async getMyClaims(@Req() req: any) {
    const customerId = req.user.sub;
    return await this.claimsService.getCustomerClaims(customerId);
  }

  @Get('promotion/:promotionId/total-quantity')
  @UseGuards(JwtAuthGuard)
  async getUserRedeemedTotal(
    @Param('promotionId') promotionId: string,
    @Req() req: any,
  ) {
    // Pega o ID do usuário diretamente do payload decodificado do JWT
    const userId = req.user.sub;

    const total = await this.claimsService.getUserRedeemedQuantityByPromotion(
      promotionId,
      userId,
    );

    return { total };
  }
}
