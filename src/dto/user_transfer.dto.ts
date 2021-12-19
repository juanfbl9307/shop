import { IsNumber } from 'class-validator';

export class TransferCashDto {
  @IsNumber()
  senderUserId: number;

  @IsNumber()
  cash: number;

  @IsNumber()
  receptorUserId: number;
}
