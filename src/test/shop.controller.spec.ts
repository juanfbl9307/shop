import { Test, TestingModule } from '@nestjs/testing';
import { ShopController } from '../shop.controller';
import { ShopService } from '../shop.service';

jest.mock('../shop.service');

describe('ShopController', () => {
  let shopController: ShopController;
  let shopService: ShopService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ShopController],
      providers: [ShopService],
    }).compile();

    shopController = app.get<ShopController>(ShopController);
    shopService = app.get<ShopService>(ShopService);

    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should call shopService and return the user created', async () => {
      const userCreated = {
        id: 1,
        username: 'test username',
        email: 'test@email.com',
        balance: 100,
      };
      jest.spyOn(shopService, 'create').mockResolvedValue(userCreated);
      const params = {
        username: 'test username',
        email: 'test@email.com',
        balance: 100,
      };
      const got = await shopController.createUser(params);
      expect(shopService.create).toBeCalled();
      expect(shopService.create).toBeCalledWith(params);
      expect(got).toEqual(userCreated);
    });
  });

  describe('createOrder', () => {
    it('should call shopService and return an order created', async () => {
      const orderCreated = {
        OrderCreated: {
          userId: 1,
          products: [
            {
              id: 1,
              price: 100,
            },
            {
              id: 2,
              price: 50,
            },
            {
              id: 3,
              price: 150,
            },
          ],
          totalPrice: 300,
        },
      };
      const params = {
        userId: 1,
        productsId: [1, 2, 3],
      };
      jest.spyOn(shopService, 'createOrder').mockResolvedValue(orderCreated);
      const got = await shopController.createOrder(params);
      expect(shopService.createOrder).toBeCalled();
      expect(shopService.createOrder).toBeCalledWith(params);
      expect(got).toEqual(orderCreated);
    });
  });
  describe('createProduct', () => {
    it('should call shopService and return a product created', async () => {
      const productCreated = {
        id: 3,
        name: 'soda',
        price: 150,
      };
      jest
        .spyOn(shopService, 'createProduct')
        .mockResolvedValue(productCreated);
      const params = { name: 'soda', price: 150 };
      const got = await shopController.createProduct(params);
      expect(shopService.createProduct).toBeCalled();
      expect(shopService.createProduct).toBeCalledWith(params);
      expect(got).toEqual(productCreated);
    });
  });
  describe('buyOrder', () => {
    it('Should call shopservice and update the balance of the user', async () => {
      const userNewBalance = {
        id: 1,
        username: 'test name',
        email: 'test@email.com',
        balance: 100,
      };
      jest.spyOn(shopService, 'buyOrder').mockResolvedValue(userNewBalance);
      const params = { userId: 1, orderId: 1 };
      const got = await shopController.buyOrder(params);
      expect(shopService.buyOrder).toBeCalled();
      expect(shopService.buyOrder).toBeCalledWith(params);
      expect(got).toEqual(userNewBalance);
    });
  });
  describe('addFunds', () => {
    it('Should call shopService and update', async () => {
      const userNewBalance = {
        id: 1,
        username: 'test name',
        email: 'test@email.com',
        balance: 100,
      };
      jest.spyOn(shopService, 'addFunds').mockResolvedValue(userNewBalance);
      const params = { userId: 1, cash: 100 };
      const got = await shopController.addFunds(params);
      expect(shopService.addFunds).toBeCalled();
      expect(shopService.addFunds).toBeCalledWith(params);
      expect(got).toEqual(userNewBalance);
    });
  });

  describe('transferCash', () => {
    it('Should call shopService and update both users balance', async () => {
      const userNewBalance = {
        Sender: {
          id: 1,
          username: 'test name',
          email: 'test@email.com',
          balance: 100,
        },
        Receptor: {
          id: 2,
          username: 'test name two',
          email: 'test2@email.com',
          balance: 200,
        },
      };
      jest.spyOn(shopService, 'transferCash').mockResolvedValue(userNewBalance);
      const params = { senderUserId: 1, cash: 100, receptorUserId: 2 };
      const got = await shopController.transferCash(params);
      expect(shopService.transferCash).toBeCalled();
      expect(shopService.transferCash).toBeCalledWith(params);
      expect(got).toEqual(userNewBalance);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
