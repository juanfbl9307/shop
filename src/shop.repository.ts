import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from './interface/user.entity';
import { PrismaService } from './prisma.service';

@Injectable()
export class ShopRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(params): Promise<UserEntity> {
    const user = {
      username: params.username,
      email: params.email,
      balance: params.balance,
    };
    try {
      const create = await this.prismaService.user.create({ data: user });
      return {
        id: create.id,
        username: create.username,
        email: create.email,
        balance: create.balance,
      };
    } catch (e) {
      if (e.code == 'P2002') {
        throw new BadRequestException('Username already exist');
      }
      throw e;
    }
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
    try {
      return await this.prismaService.product.create({
        data: { name: product.name, price: product.price },
      });
    } catch (e) {
      if (e.code == 'P2002') {
        throw new BadRequestException('Username already exist');
      }
      throw e;
    }
  }

  async totalOrderPrice(orderId) {
    return await this.prismaService.orderPlaced.aggregate({
      where: {
        order_id: orderId,
      },
      _sum: {
        product_price: true,
      },
    });
  }

  async subtract(userId, orderPrice) {
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

  async ordersList(userId) {
    return await this.prismaService.order.findMany({
      where: { user_id: userId },
      include: { orders: { include: { order: true } } },
    });
  }
}
