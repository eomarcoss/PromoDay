import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsArray,
  IsDateString,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreatePromotionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  limitPerUser: number;

  @IsDateString()
  startTime: string; // O front envia como string ISO (ex: "2026-06-16T18:00:00.000Z")

  @IsDateString()
  endTime: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  originalPrice: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  promoPrice: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Valida que cada item dentro do array é uma string (URL)
  images: string[];
}
