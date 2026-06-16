import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('sellers') // 👈 Todas as rotas aqui começam com /sellers
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Post() // 👈 Rota: POST /sellers (Cadastro público do vendedor)
  create(@Body() createSellerDto: CreateSellerDto) {
    return this.sellersService.create(createSellerDto);
  }

  @Get()
  findAll() {
    return this.sellersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard) // 🔒 Protege a rota exigindo o token JWT do vendedor
  @Patch('profile') // 👈 Rota: PATCH /sellers/profile
  update(@Request() req: any, @Body() updateSellerDto: UpdateSellerDto) {
    // Pegamos o ID direto do token descriptografado pelo Guard
    const sellerId = req.user.sub;
    return this.sellersService.update(sellerId, updateSellerDto);
  }
  z;
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellersService.remove(+id);
  }
}
