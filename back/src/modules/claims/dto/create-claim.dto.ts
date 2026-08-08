import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ValidateClaimDto {
  @IsString()
  @IsNotEmpty({ message: 'O código do cupom é obrigatório.' })
  @Matches(/^PD-[A-Z0-9]{6}$/, {
    message: 'Formato de código inválido. Exemplo esperado: PD-XXXXXX',
  })
  code: string;
}
