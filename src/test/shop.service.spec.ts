import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { async } from 'rxjs';
import { ShopRepository } from '../shop.repository';
import { ShopService } from '../shop.service';

jest.mock('../shop.repository');

describe('ShopController', () => {
  let shopService: ShopService;
  let shopRepository: ShopRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [ShopService, ShopRepository],
    }).compile();

    shopService = app.get<ShopService>(ShopService);
    shopRepository = app.get<ShopRepository>(ShopRepository);

    jest.clearAllMocks();
  });
  describe('create', () => {
    it('Should call the shopRepository and create a new user', async () => {
      const userCreated = {
        id: 1,
        username: 'test username',
        email: 'test@email.com',
        balance: 100,
      };
      jest.spyOn(shopRepository, 'create').mockResolvedValue(userCreated);
      const params = {
        username: 'test username',
        email: 'test@email.com',
        balance: 100,
      };
      const got = await shopService.create(params);
      expect(shopRepository.create).toBeCalled();
      expect(shopRepository.create).toBeCalledWith(params);
      expect(got).toEqual(userCreated);
    });
  });
  describe('createProdut', () => {
    it('Shoudl call the shopRepository and create a new product', async () => {
      const productCreated = {
        id: 3,
        name: 'soda',
        price: 150,
      };
      jest
        .spyOn(shopRepository, 'createProduct')
        .mockResolvedValue(productCreated);
      const params = { name: 'soda', price: 150 };
      const got = await shopService.createProduct(params);
      expect(shopRepository.createProduct).toBeCalled();
      expect(shopRepository.createProduct).toBeCalledWith(params);
      expect(got).toEqual(productCreated);
    });
  });
  describe('createOder', () => {
    const orderCreated = {
      id: 1,
      user_id: 1,
    };
    const params = {
      userId: 1,
      productsId: [1, 2, 3],
    };
    const productList = [
      { id: 1, price: 100 },
      { id: 2, price: 200 },
      { id: 3, price: 300 },
    ];
    const productsId = params.productsId;
    const orderAmount = productList.reduce((acc, current) => {
      return current.price + acc;
    }, 0);
    const orderParams = [];
    productList.forEach((product) => {
      orderParams.push({
        order_id: orderCreated.id,
        product_id: product.id,
        product_price: product.price,
      });
    });
    const orderProducts = {
      OrderCreated: {
        userId: 1,
        products: [
          {
            id: 1,
            price: 100,
          },
          {
            id: 2,
            price: 200,
          },
          {
            id: 3,
            price: 300,
          },
        ],
        totalPrice: orderAmount,
      },
    };
    beforeEach(async () => {
      jest.spyOn(shopRepository, 'getProducts').mockResolvedValue(productList);
      jest.spyOn(shopRepository, 'createOder').mockResolvedValue(orderCreated);
      await shopService.createOrder(params);
    });
    it('Should call the shopRepository and create the order with the user_id', async () => {
      expect(shopRepository.createOder).toBeCalled();
      expect(shopRepository.createOder).toBeCalledWith(params.userId);
      expect(await shopRepository.createOder(params.userId)).toEqual(
        orderCreated,
      );
    });
    it('Should call the shopRepository and get the products with the product id', async () => {
      expect(shopRepository.getProducts).toBeCalled();
      expect(shopRepository.getProducts).toBeCalledWith(productsId);
      expect(await shopRepository.getProducts(productsId)).toEqual(productList);
    });
    it('Should call the shopRepository and get the products with the product id', async () => {
      expect(shopRepository.placeOrders).toBeCalled();
      expect(shopRepository.placeOrders).toBeCalledWith(orderParams);
    });
    it('Should the order create', async () => {
      expect(await shopService.createOrder(params)).toEqual(orderProducts);
    });
  });
  describe('buyOrder', () => {
    const orderPrice = { _sum: { product_price: 600 } };
    const userBalance = { balance: 1000 };
    const params = { userId: 1, orderId: 1 };
    const user = {
      id: 1,
      username: 'test username',
      email: 'test@email.com',
      balance: 100,
    };
    beforeEach(async () => {
      jest
        .spyOn(shopRepository, 'totalOrderPrice')
        .mockResolvedValue(orderPrice);
      jest.spyOn(shopRepository, 'userBalance').mockResolvedValue(userBalance);
      jest.spyOn(shopRepository, 'substract').mockResolvedValue(user);
      await shopService.buyOrder(params);
    });
    it('Should get the amount of the order by id', async () => {
      expect(shopRepository.totalOrderPrice).toBeCalled();
      expect(shopRepository.totalOrderPrice).toBeCalledWith(params.orderId);
      expect(await shopRepository.totalOrderPrice(params.orderId)).toEqual(
        orderPrice,
      );
    });
    it('Should get the balance of the user by id', async () => {
      expect(shopRepository.userBalance).toBeCalled();
      expect(shopRepository.userBalance).toBeCalledWith(params.userId);
      expect(await shopRepository.userBalance(params.userId)).toEqual(
        userBalance,
      );
    });
    it('Should return the user after substract the amount from the balance', async () => {
      expect(shopRepository.substract).toBeCalled();
      expect(shopRepository.substract).toBeCalledWith(
        params.userId,
        orderPrice._sum.product_price,
      );
      expect(
        await shopRepository.substract(
          params.userId,
          orderPrice._sum.product_price,
        ),
      ).toEqual(user);
    });
    it('Should throw BadRequestException if the user balance is insufficient', async () => {
      jest
        .spyOn(shopRepository, 'userBalance')
        .mockResolvedValue({ balance: 1 });
      await expect(shopService.buyOrder(params)).rejects.toThrow(
        new BadRequestException('Insufficient Founds'),
      );
    });
  });

  describe('addFunds', () => {
    const userBalance = { balance: 1000 };
    const params = {
      senderUserId: 1,
      cash: 100,
      receptorUserId: 2,
    };
    const sender = {
      id: 1,
      username: 'test username',
      email: 'test@email.com',
      balance: 200,
    };
    const receptor = {
      id: 2,
      username: 'test username2',
      email: 'test2@email.com',
      balance: 150,
    };

    beforeEach(async () => {
      jest.spyOn(shopRepository, 'userBalance').mockResolvedValue(userBalance);
      jest.spyOn(shopRepository, 'addFunds').mockResolvedValue(receptor);
      jest.spyOn(shopRepository, 'substract').mockResolvedValue(sender);

      await shopService.transferCash(params);
    });
    it('Should get the user balance and validate if is enough', async () => {
      expect(shopRepository.userBalance).toBeCalled();
      expect(shopRepository.userBalance).toBeCalledWith(params.senderUserId);
      expect(await shopRepository.userBalance(params.senderUserId)).toEqual(
        userBalance,
      );
    });
    it('Should throw BadRequestException if the user balance is insufficient', async () => {
      jest
        .spyOn(shopRepository, 'userBalance')
        .mockResolvedValue({ balance: 1 });
      await expect(shopService.transferCash(params)).rejects.toThrow(
        new BadRequestException('Insufficient Founds'),
      );
    });
    it('Should update the receptor balance and sender', async () => {
      expect(shopRepository.addFunds).toBeCalled();
      expect(shopRepository.addFunds).toBeCalledWith(
        params.receptorUserId,
        params.cash,
      );
      expect(
        await shopRepository.addFunds(params.receptorUserId, params.cash),
      ).toEqual(receptor);
      expect(shopRepository.substract).toBeCalled();
      expect(shopRepository.substract).toBeCalledWith(
        params.senderUserId,
        params.cash,
      );
      expect(
        await shopRepository.substract(params.senderUserId, params.cash),
      ).toEqual(sender);
    });
    it('Should call the shopRepository and update the balance of the sender and the receptor', async () => {
      expect(await shopService.transferCash(params)).toEqual({
        Sender: sender,
        Receptor: receptor,
      });
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
