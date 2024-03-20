import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ValidationException } from '../implements';
import { HttpLoggingInterceptor } from '../interceptors';
import { BootstrapOptions } from '../interfaces';

export const createBootstrapOptions = (): BootstrapOptions => {
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
    filters: [],
  };
};
