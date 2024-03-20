import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';

import { HttpLog } from '../implements';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger();

  constructor(readonly mode?: 'nest' | 'winston') {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const httpLog = HttpLog.get(context.switchToHttp().getRequest()).setContext(context);

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const args = httpLog.setResponse(res).getArgs();
        this.logger.verbose(...args);
      }),
      catchError((e) => {
        let exception = e as HttpException;

        if (exception instanceof HttpException) {
          const args = httpLog.setException(exception).getArgs();
          this.logger.warn(...args);
        } else {
          exception = new InternalServerErrorException(e.message ?? e.name);
          const args = httpLog.setException(exception).setError(e).getArgs();
          this.logger.error(...args);
        }

        return throwError(() => exception);
      }),
    );
  }
}
