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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../guards/roles.guard';

@Controller('sellers') // 👈 Todas as rotas aqui começam com /sellers
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Post() // 👈 Rota: POST /sellers (Cadastro público do vendedor)
  @UseInterceptors(FileInterceptor('avatar'))
  create(
    @Body() createSellerDto: CreateSellerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.sellersService.create(createSellerDto, file);
  }

  @Get()
  findAll() {
    return this.sellersService.findAll();
  }

  @UseGuards(JwtAuthGuard) // Guard de autenticação do seu projeto
  @Get('metrics')
  async getMetrics(@Request() req: any) {
    const sellerId = req.user.sub;
    console.log('Seller', sellerId);
    return this.sellersService.getMetrics(sellerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) // 🔒 Protege a rota exigindo o token JWT do vendedor
  @Patch('profile') // 👈 Rota: PATCH /sellers/profile
  update(@Request() req: any, @Body() updateSellerDto: UpdateSellerDto) {
    // Pegamos o ID direto do token descriptografado pelo Guard
    const sellerId = req.user.sub;
    return this.sellersService.update(sellerId, updateSellerDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) // 🔒 Protege a rota exigindo o token JWT
  @Delete('profile') // 👈 Rota: DELETE /sellers/profile
  remove(@Request() req: any) {
    const sellerId = req.user.sub;
    return this.sellersService.remove(sellerId);
  }
}
