import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

import { HttpLog } from '../implements';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const httpLog = HttpLog.get(context.switchToHttp().getRequest()).setContext(context);

    return next.handle().pipe(tap(() => this.logger.verbose(httpLog.setResponse(context.switchToHttp().getResponse()))));
  }
}
