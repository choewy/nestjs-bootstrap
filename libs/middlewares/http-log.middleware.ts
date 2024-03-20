import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { HttpLog } from '../implements';

@Injectable()
export class HttpLogMiddleware implements NestMiddleware {
  static use(req: Request, _: Response, next: NextFunction) {
    HttpLog.set(req);
    next();
  }

  use(req: Request, res: Response, next: NextFunction) {
    return HttpLogMiddleware.use(req, res, next);
  }
}
