import { PartialType } from '@nestjs/mapped-types';
import { CreateCostomerDto } from './create-costomer.dto';
import { IsOptional, IsString, IsUrl } from 'class-validator';

// O PartialType herda automaticamente os campos do CreateCostomerDto como opcionais
export class UpdateCostomerDto extends PartialType(CreateCostomerDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsUrl({}, { message: 'A fotoUrl deve ser um link válido do Supabase' })
  avatarUrl?: string;
}
