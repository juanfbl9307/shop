import { Test, TestingModule } from '@nestjs/testing';
import { ShopRepository } from '../src/shop.repository';

describe('Src', () => {
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
