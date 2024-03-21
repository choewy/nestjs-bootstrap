import { HttpLog } from './implements/http-log';

declare global {
  namespace Express {
    export interface Request {
      user?: any;
      httpLog?: HttpLog;
    }
  }
}
