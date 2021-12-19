import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class AddFundsDto {
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @IsNumber()
  @Type(() => Number)
  cash: number;
}
