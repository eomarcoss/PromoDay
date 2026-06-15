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
} from '@nestjs/common';
import { CostomersService } from './costomers.service';
import { CreateCostomerDto } from './dto/create-costomer.dto';
import { UpdateCostomerDto } from './dto/update-costomer.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Get()
  findAll() {
    return this.costomersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.costomersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCostomerDto: UpdateCostomerDto,
  ) {
    return this.costomersService.update(id, updateCostomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.costomersService.remove(id);
  }
}
