import { PartialType } from '@nestjs/mapped-types';
import { CreateSellerDto } from './create-seller.dto';
import { IsOptional, IsString, IsUrl, IsNotEmpty } from 'class-validator';

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

  // No seu create-seller.dto.ts

  @IsString({
    message: 'O horário de funcionamento deve ser uma string JSON válida',
  })
  businessHours: string; // 🚀 Agora aceita a string vinda do FormData

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  file?: any;
}
