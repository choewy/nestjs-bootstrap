import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

import { HttpLog } from '../implements';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(readonly mode?: 'nest' | 'winston') {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();
    const httpLog = HttpLog.get(req).setContext(context).setUser(req.user);

    return next.handle().pipe(
      tap(() => {
        if (['/', '/health'].includes(req.path)) {
          Logger.debug(...httpLog.setResponse(context.switchToHttp().getResponse()).getArgs());
        } else {
          Logger.verbose(...httpLog.setResponse(context.switchToHttp().getResponse()).getArgs());
        }
      }),
    );
  }
}
