import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { HttpExceptionFilter } from '../filters';
import { ValidationException } from '../implements';
import { HttpLoggingInterceptor } from '../interceptors';
import { BootstrapOptions } from '../interfaces';
import { HttpLogMiddleware } from '../middlewares';

export const createBootstrapOptions = (app: INestApplication): BootstrapOptions => {
  app.use(HttpLogMiddleware.use);

  return {
    interceptors: [
      new ClassSerializerInterceptor(new Reflector(), {
        enableImplicitConversion: true,
        enableCircularCheck: true,
      }),
      new HttpLoggingInterceptor(),
    ],
    pipes: [
      new ValidationPipe({
        stopAtFirstError: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
          enableCircularCheck: true,
        },
        exceptionFactory(errors) {
          throw new ValidationException(errors);
        },
      }),
    ],
    filters: [new HttpExceptionFilter()],
  };
};
