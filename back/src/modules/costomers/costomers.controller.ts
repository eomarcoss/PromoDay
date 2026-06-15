import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CostomersService } from './costomers.service';
import { CreateCostomerDto } from './dto/create-costomer.dto';
import { UpdateCostomerDto } from './dto/update-costomer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('costomers')
export class CostomersController {
  constructor(private readonly costomersService: CostomersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  create(
    @Body() createCostomerDto: CreateCostomerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.costomersService.create(createCostomerDto, file);
  }

  @Patch('profile') // 👈 fica apenas 'costomers/profile'
  @UseGuards(JwtAuthGuard) // 🔒 Protege a rota com o teu Guard
  update(
    @Request() req, // 👈 Captura a requisição para ler o token decodificado
    @Body() updateCostomerDto: UpdateCostomerDto,
  ) {
    // O teu JwtAuthGuard injeta o payload do token dentro de req.user
    // No passo anterior, configuramos o ID do utilizador no campo 'sub'
    const userId = req.user.sub;

    return this.costomersService.update(userId, updateCostomerDto);
  }

  @Delete('profile') // 👈 Rota: DELETE costomers/account (sem expor ID na URL)
  @UseGuards(JwtAuthGuard) // 🔒 Apenas usuários logados podem acessar
  remove(@Request() req) {
    // Pegamos o ID do usuário de dentro do token decodificado
    const userId = req.user.sub;

    return this.costomersService.remove(userId);
  }

  @Get()
  findAll() {
    return this.costomersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.costomersService.findOne(id);
  }
}
