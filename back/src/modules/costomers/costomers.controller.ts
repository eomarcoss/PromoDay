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
  constructor(private readonly costomersService: CostomersService) { }

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  create(
    @Body() createCostomerDto: CreateCostomerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.costomersService.create(createCostomerDto, file);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file')) // Intercepta a chave 'file' do FormData
  async update(
    @Request() req: any,
    @Body() updateCostomerDto: UpdateCostomerDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.sub;
    return this.costomersService.update(userId, updateCostomerDto, file);
  }

  @Delete('profile') // 👈 Rota: DELETE costomers/account (sem expor ID na URL)
  @UseGuards(JwtAuthGuard) // 🔒 Apenas usuários logados podem acessar
  remove(@Request() req) {
    // Pegamos o ID do usuário de dentro do token decodificado
    const userId = req.user.sub;

    return this.costomersService.remove(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    // Extrai o ID do cliente do payload do JWT injetado no req.user
    const customerId = req.user.sub;
    return this.costomersService.getProfile(customerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.costomersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('metrics')
  getMetrics(@Request() req) {
    // req.user é injetado pelo JwtAuthGuard após validar o JWT
    const customerId = req.user.sub;

    return this.costomersService.getMetrics(customerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.costomersService.findOne(id);
  }
}
