import { NestFactory } from '@nestjs/core';

import { AppModule } from './app';
import { createBootstrapOptions } from './helpers';

async function bootstrap() {
  const bootstrapOptions = createBootstrapOptions();
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(...bootstrapOptions.interceptors);
  app.useGlobalPipes(...bootstrapOptions.pipes);

  await app.listen(3000);
}

bootstrap();
