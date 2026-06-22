import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsArray,
} from 'class-validator';

export class CreateSellerDto {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  @IsString()
  phone: string;

  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @IsEmail({}, { message: 'Insira um e-mail válido' })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @IsString()
  // Aqui você pode adicionar uma validação de tamanho mínimo se quiser, ex: @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'O avatarUrl deve ser um link válido' })
  avatarUrl?: string;

  @IsNotEmpty({ message: 'O endereço é obrigatório' })
  @IsString()
  address: string;

  @IsNotEmpty({ message: 'O horário de funcionamento é obrigatório' })
  @IsString({
    message: 'O horário de funcionamento deve ser uma string JSON válida',
  })
  businessHours: string; // 🚀 Agora aceita a string vinda do FormData

  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  @IsString()
  category: string;
}
