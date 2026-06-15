import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsUrl,
} from 'class-validator';
export class CreateCostomerDto {
  @IsString({ message: 'O nome deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name: string;

  @IsEmail({}, { message: 'Por favor, insira um e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @IsString({ message: 'O telefone deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O telefone é obrigatório.' })
  phone: string;

  @IsString({ message: 'A senha deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve conter no mínimo 6 caracteres.' })
  password: string;

  @IsOptional() // O usuário não é obrigado a ter foto no primeiro segundo de cadastro
  @IsString()
  @IsUrl({}, { message: 'O avatarUrl deve ser um link válido do Supabase.' })
  avatarUrl?: string; // Use o nome exato da sua coluna no banco (avatarUrl ou fotoUrl)
}
