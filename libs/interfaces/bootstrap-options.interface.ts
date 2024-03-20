import { ExceptionFilter, NestInterceptor, PipeTransform } from '@nestjs/common';

export interface BootstrapOptions {
  interceptors: NestInterceptor[];
  filters: ExceptionFilter[];
  pipes: PipeTransform[];
}
