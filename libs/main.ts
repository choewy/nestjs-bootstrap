import { NestFactory } from '@nestjs/core';

import { AppModule } from './app';
import { HttpLoggingInterceptor } from './interceptors';
import { HttpLogMiddleware } from './middlewares';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(HttpLogMiddleware.use);
  app.useGlobalInterceptors(new HttpLoggingInterceptor());

  await app.listen(3000);
}

bootstrap();
