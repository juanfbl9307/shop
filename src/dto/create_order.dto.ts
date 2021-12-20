import { IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  userId: number;

  @IsNumber({}, { each: true })
  productsId: number[];
}
