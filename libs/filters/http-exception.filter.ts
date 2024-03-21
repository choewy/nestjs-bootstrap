import { ArgumentsHost, Catch, HttpException, InternalServerErrorException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

import { HttpLog } from '../implements';

@Catch(HttpException, Error)
export class HttpExceptionFilter extends BaseExceptionFilter {
  catch(e: HttpException | Error, host: ArgumentsHost): void {
    const httpLog = HttpLog.get(host.switchToHttp().getRequest());

    let exception = e as HttpException;

    if (exception instanceof HttpException) {
      Logger.warn(...httpLog.setException(exception).getArgs());
    } else {
      exception = new InternalServerErrorException(e.message ?? e.name);
      Logger.error(...httpLog.setException(exception).setError(e).getArgs());
    }

    host.switchToHttp().getResponse<Response>().status(exception.getStatus()).send(exception.getResponse());
  }
}
