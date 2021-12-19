import { Body, Controller, Patch, Post, Query } from '@nestjs/common';
import { ShopService } from './shop.service';
import { UserEntity, UserTransfer } from './interface/user.entity';
import {Order, Purchase} from './interface/order.entity';

@Controller('store')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('user')
  createUser(@Body() params: CreateUserDto): Promise<UserEntity> {
    return this.shopService.create({ ...params });
  }

  @Post('order')
  createOrder(@Body() params: CreateOrderDto): Promise<Order> {
    return this.shopService.createOrder({ ...params });
  }

  @Patch('buy')
  buyOrder(@Query() params: BuyOderDto): Promise<Purchase> {
    return this.shopService.buyOrder(params);
  }

  @Patch('addfunds')
  addFunds(@Query() params: AddFundsDto): Promise<UserEntity> {
    return this.shopService.addFunds(params);
  }

  @Patch('transfer')
  transferCash(@Body() params: TransferCashDto): Promise<UserTransfer> {
    return this.shopService.transferCash(params);
  }
}
