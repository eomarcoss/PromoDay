import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsArray,
  IsDateString,
  Min,
} from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsInt()
  @Min(0)
  stock: number;

  @IsInt()
  @Min(0)
  limitPerUser: number;

  @IsDateString()
  startTime: string; // O front envia como string ISO (ex: "2026-06-16T18:00:00.000Z")

  @IsDateString()
  endTime: string;

  @IsNumber()
  @Min(0)
  originalPrice: number;

  @IsNumber()
  @Min(0)
  promoPrice: number;

  @IsArray()
  @IsString({ each: true }) // Valida que cada item dentro do array é uma string (URL)
  images: string[];
}
