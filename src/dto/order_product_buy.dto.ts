import { Type } from 'class-transformer';
import { IsNumber, IsNumberString, IsString } from 'class-validator';

export class OrderProductBuyDto {
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @IsNumber()
  @Type(() => Number)
  orderId: number;
}
