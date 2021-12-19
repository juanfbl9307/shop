import { BadRequestException, Injectable } from '@nestjs/common';
import { ShopRepository } from './shop.repository';
import { Order, Purchase } from './interface/order.entity';
import { User, UserTransfer } from './interface/user.entity';
import { Product } from './interface/product.entity';

@Injectable()
export class ShopService {
  constructor(private readonly shopRepository: ShopRepository) {}
  create(params): Promise<User> {
    return this.shopRepository.create(params);
  }

  async createProduct(product): Promise<Product> {
    return await this.shopRepository.createProduct(product);
  }

  async createOrder(params): Promise<any> {
    const order = await this.shopRepository.createOder(params.userId);
    const productsId = params.productsIds;
    let products = await this.shopRepository.getProducts(productsId);
    const orderAmount = products.reduce((acc, current) => {
      return current.price + acc;
    }, 0);
    const orderParams = [];
    products.forEach((product) => {
      orderParams.push({
        order_id: order.id,
        product_id: product.id,
        product_price: product.price,
      });
    });
    await this.shopRepository.placeOrders(orderParams);

    return {
      OrderCreater: {
        userId: params.userId,
        products: products,
        totalPrice: orderAmount,
      },
    };
  }

  async buyOrder(params): Promise<User> {
    console.log(params);
    const amount = await this.shopRepository.totalOderPrice(params.orderId);
    const userBalance = await this.shopRepository.userBalance(params.userId);
    if (amount._sum.product_price > userBalance.balance)
      throw new BadRequestException('Insufficient Founds');
    return this.shopRepository.substract(
      params.userId,
      amount._sum.product_price,
    );
  }

  async addFunds(params): Promise<User> {
    return this.shopRepository.addFunds(params.userId, params.cash);
  }

  async transferCash(params): Promise<any> {
    const userBalance = await this.shopRepository.userBalance(
      params.senderUserId,
    );
    if (params.cash > userBalance.balance)
      throw new BadRequestException('Insufficient Founds');
    const receptor = await this.shopRepository.addFunds(
      params.receptorUserId,
      params.cash,
    );
    const sender = await this.shopRepository.substract(
      params.senderUserId,
      params.cash,
    );

    const response = {
      Sender: sender,
      Receptor: receptor,
    };
    return response;
  }
}
