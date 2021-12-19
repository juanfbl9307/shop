import { BadRequestException, Injectable } from '@nestjs/common';
import { ShopRepository } from './shop.repository';
import {Order, Purchase} from "./interface/order.entity";
import {User, UserEntity, UserTransfer} from "./interface/user.entity";


@Injectable()
export class ShopService {
  constructor(private readonly shopRepository: ShopRepository) {}
  create(params): Promise<User> {
    return this.shopRepository.create(params);
  }

  async createOrder(params): Promise<Order> {
    const articlesNames = params.map((product) => product.name);
    const amount = params.reduce((total, price) => {
      return total + price;
    }, 0);
    const order = { articles: articlesNames, amount: amount };
    return this.shopRepository.createOder(order);
  }

  async buyOrder(params): Promise<Purchase> {
    const amount = this.shopRepository.getOrder(params.order);
    const userBalance = this.shopRepository.getBalance(params.username);
    if (amount > userBalance)
      throw new BadRequestException('Insufficient Founds');
    return this.shopRepository.substract(amount);
  }

  async addFunds(params): Promise<User> {
    return this.shopRepository.addFunds(params);
  }

  async transferCash(params): Promise<UserTransfer> {
    const userBalance = this.shopRepository.getBalance(params.username);
    const receptor = { username: params.receptor, cash: params.cash };
    const sender = { username: params.username, cash: params.cash };
    if (params.cash > userBalance)
      throw new BadRequestException('Insufficient Founds');
    const transfer = this.shopRepository.addFunds(receptor);
    await this.shopRepository.substract(sender);
    return transfer;
  }
}
