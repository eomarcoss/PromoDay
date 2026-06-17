import { PartialType } from '@nestjs/mapped-types';
import { CreatePromotionDto } from './create-promotion.dto';

// O PartialType faz com que todos os campos do CreatePromotionDto virem opcionais (?, ex: name?, stock?)
// mas mantém as validações como @IsInt, @Min, @IsDateString rodando caso o campo venha na requisição.
export class UpdatePromotionDto extends PartialType(CreatePromotionDto) {}
