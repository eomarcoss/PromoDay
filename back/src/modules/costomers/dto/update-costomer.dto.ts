import { PartialType } from '@nestjs/mapped-types';
import { CreateCostomerDto } from './create-costomer.dto';

export class UpdateCostomerDto extends PartialType(CreateCostomerDto) {}
