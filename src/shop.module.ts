import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { ShopRepository } from './shop.repository';
import { DatabaseModule } from './database/database.module';

@Module({
  controllers: [ShopController],
  providers: [ShopService, ShopRepository],
  imports: [DatabaseModule],
})
export class ShopModule {}
