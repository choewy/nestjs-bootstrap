import { NestFactory } from '@nestjs/core';

import { AppModule } from './app';
import { createBootstrapOptions } from './helpers';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const bootstrapOptions = createBootstrapOptions(app);

  app.useGlobalInterceptors(...bootstrapOptions.interceptors);
  app.useGlobalPipes(...bootstrapOptions.pipes);
  app.useGlobalFilters(...bootstrapOptions.filters);

  await app.listen(3000);
}

bootstrap();
