import { HttpLog } from './implements/http-log';

declare global {
  namespace Express {
    export interface Request {
      user?: any;
      context?: string;
      handler?: string;
      httpLog?: HttpLog;
    }
  }
}
