import { NestFactory } from '@nestjs/core';
import { ShopModule } from './shop.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    ShopModule,
    new FastifyAdapter(),
  );
  await app.listen(3000);
}
bootstrap();
