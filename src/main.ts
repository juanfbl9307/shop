import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ShopModule } from './shop.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    ShopModule,
    new FastifyAdapter(),
  );
  await app.listen(3000);
}
bootstrap();
