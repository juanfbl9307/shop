import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { ShopRepository } from './shop.repository';
import { PrismaService } from './prisma.service';

@Module({
  controllers: [ShopController],
  providers: [ShopService, ShopRepository, PrismaService],
  imports: [],
})
export class ShopModule {}
