import { IsUUID, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateClaimDto {
  @IsUUID()
  @IsNotEmpty()
  promotionId: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}
