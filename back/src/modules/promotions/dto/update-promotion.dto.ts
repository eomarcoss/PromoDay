import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsDateString,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePromotionDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'O estoque deve ser de pelo menos 1.' })
  stock?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'O limite por usuário deve ser de pelo menos 1.' })
  limitPerUser?: number;

  @IsOptional()
  @IsDateString({}, { message: 'A data final deve ser uma data válida.' })
  endTime?: string;

  @IsOptional()
  existingImages?: string | string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Valida que cada item dentro do array é uma string (URL)
  images?: string[];

  claims?: any[]; // Adicione esta linha para claims, se necessário
}
