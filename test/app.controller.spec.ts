import { Test, TestingModule } from '@nestjs/testing';
import { ShopController } from '../src/shop.controller';
import { ShopService } from '../src/shop.service';

describe('AppController', () => {
  let appController: ShopController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ShopController],
      providers: [ShopService],
    }).compile();

    appController = app.get<ShopController>(ShopController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
