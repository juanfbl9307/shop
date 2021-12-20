import { Test, TestingModule } from '@nestjs/testing';
import { ShopRepository } from '../shop.repository';

describe('ShopRepository', () => {
  let provider: ShopRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopRepository],
    }).compile();

    provider = module.get<ShopRepository>(ShopRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
