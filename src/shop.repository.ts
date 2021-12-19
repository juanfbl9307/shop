import { Inject, Injectable } from '@nestjs/common';
import { User } from './interface/user.entity';
import { PrismaService } from './prisma.service';

@Injectable()
export class ShopRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(params): Promise<User> {
    const user = {
      username: params.username,
      email: params.email,
      balance: params.balance,
    };
    const create = await this.prismaService.user.create({ data: user });
    return {
      username: create.username,
      email: create.email,
      balance: create.balance,
    };
  }

  async userBalance(userId) {
    return await this.prismaService.user.findUnique({
      select: { balance: true },
      where: { id: userId },
    });
  }

  async getProducts(productsId): Promise<any[]> {
    const product = await this.prismaService.product.findMany({
      select: { id: true, price: true },
      where: { id: { in: productsId } },
    });
    return product;
  }

  async placeOrders(products) {
    return this.prismaService.orderPlaced.createMany({ data: products });
  }

  async createOder(userId) {
    return await this.prismaService.order.create({ data: { user_id: userId } });
  }

  async createProduct(product) {
    return await this.prismaService.product.create({
      data: { name: product.name, price: product.price },
    });
  }

  async totalOderPrice(orderId) {
    return await this.prismaService.orderPlaced.aggregate({
      where: {
        order_id: orderId,
      },
      _sum: {
        product_price: true,
      },
    });
  }

  async substract(userId, orderPrice) {
    return await this.prismaService.user.update({
      data: { balance: { decrement: orderPrice } },
      where: { id: userId },
    });
  }

  async addFunds(userId, cash) {
    return await this.prismaService.user.update({
      data: { balance: { increment: cash } },
      where: { id: userId },
    });
  }
}
