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
import { Request } from 'express';
import { ClaimsService } from './claims.service';
import { ValidateClaimDto } from './dto/create-claim.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/decorators/roles.decorator';
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post('promotions/:id/claim')
  @Roles('CUSTOMER')
  @HttpCode(HttpStatus.CREATED)
  async claimPromotion(@Param('id') promotionId: string, @Req() req: any) {
    const customerId = req.user.sub; // ou req.user.sub (depende da sua JwtStrategy)
    return await this.claimsService.claimPromotion(customerId, promotionId);
  }

  @Patch('seller/claims/validate')
  @Roles('SELLER')
  @HttpCode(HttpStatus.OK)
  async validateClaim(@Req() req: any, @Body() dto: ValidateClaimDto) {
    const sellerId = req.user.sub; // ou req.user.sub
    return await this.claimsService.validateClaim(sellerId, dto.code);
  }

  @Get('redeems')
  @Roles('CUSTOMER')
  async getMyClaims(@Req() req: any) {
    const customerId = req.user.sub; // ou req.user.sub
    return await this.claimsService.getCustomerClaims(customerId);
  }
}
