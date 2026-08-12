import { IsInt, Min, IsOptional } from 'class-validator';

export class ClaimPromotionDto {
  @IsInt({ message: 'A quantidade deve ser um número inteiro.' })
  @Min(1, { message: 'A quantidade mínima de resgate é 1.' })
  @IsOptional()
  quantity?: number = 1;
}
