import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @UseGuards(JwtAuthGuard)
  @Post() // POST /claims
  create(@Body() createClaimDto: CreateClaimDto, @Request() req: any) {
    const customerId = req.user.sub; // ID do Cliente vindo do token
    return this.claimsService.create(createClaimDto, customerId);
  }
}
