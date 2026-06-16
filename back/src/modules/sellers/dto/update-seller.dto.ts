import { PartialType } from '@nestjs/mapped-types';
import { CreateSellerDto } from './create-seller.dto';
import { IsOptional, IsString, IsUrl, IsArray } from 'class-validator';

// O PartialType herda automaticamente os campos do CreateCostomerDto como opcionais
export class UpdateSellerDto extends PartialType(CreateSellerDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'O avatarUrl deve ser um link válido' })
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsArray({ message: 'O horário de funcionamento deve ser um array' })
  businessHours?: any[];

  @IsOptional()
  @IsString()
  category?: string;
}
