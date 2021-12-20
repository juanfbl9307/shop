import { Body, Controller, Patch, Post, Query, Get } from '@nestjs/common';
import { ShopService } from './shop.service';
import { User, UserEntity, UserTransfer } from './interface/user.entity';
import { Order } from './interface/order.entity';
import { CreateUserDto } from './dto/create_user.dto';
import { OrderProductBuyDto } from './dto/order_product_buy.dto';
import { AddFundsDto } from './dto/user_add_funds.dtos';
import { TransferCashDto } from './dto/user_transfer.dto';
import { CreateProductDto } from './dto/create_product.dto';
import { CreateOrderDto } from './dto/create_order.dto';
import { Product } from './interface/product.entity';

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

  @Post('product')
  createProduct(@Body() params: CreateProductDto): Promise<Product> {
    return this.shopService.createProduct({ ...params });
  }

  @Patch('buy')
  buyOrder(@Query() params: OrderProductBuyDto): Promise<User> {
    return this.shopService.buyOrder(params);
  }

  @Get('orders')
  ordersList(@Query() userId: number): Promise<any> {
    return this.shopService.ordersList({ userId: userId });
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
