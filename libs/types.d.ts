import { HttpLog } from './implements/http-log';

declare namespace Express {
  interface Request {
    user?: any;
    httpLog: HttpLog;
  }
}
