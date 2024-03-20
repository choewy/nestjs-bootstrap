import { ExecutionContext, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Creates an instance of HttpLog
 *
 * @description used in middleware
 * @param req Express.Request
 */
export class HttpLog {
  private incomingTime = Date.now();

  context: string;
  handler: string;
  method: string;
  path: string;
  params: Record<string, any>;
  query: Record<string, any>;
  ip: string;
  xforwaredfor: string;
  user?: object;
  message = '';
  status = -1;
  latency: number;
  error?: object;
  exception?: HttpException;

  constructor(req: Request) {
    this.context = req['context'];
    this.handler = (req['context'] ? [req['context'], req['handler']] : [req['handler']]).join('.');
    this.method = req.method;
    this.path = req.path;
    this.params = req.params;
    this.query = req.query;
    this.ip = req.ip;
    this.xforwaredfor = req.header['x-forwared-for'];
  }

  private static readonly KEY = 'httpLog';

  /**
   * Get HttpLog from Request
   *
   * @param request: Express.Request
   * @return HttpLog
   */
  static get(request: Request): HttpLog {
    if (request[this.KEY] instanceof HttpLog === false) {
      request[this.KEY] = new HttpLog(request);
    }

    return request[this.KEY];
  }

  /**
   * Set HttpLog to Request
   *
   * @param request: Express.Request
   * @return HttpLog
   */
  static set(request: Request): HttpLog {
    if (request[this.KEY] instanceof HttpLog === false) {
      request[this.KEY] = new HttpLog(request);
    }

    return request[this.KEY];
  }

  private end() {
    this.latency = Date.now() - this.incomingTime;
    delete this.incomingTime;
    return this;
  }

  /**
   * Set Context
   *
   * @description used in Interceptor(incoming)
   * @param context: ExecutionContext
   */
  setContext(context: ExecutionContext) {
    this.context = context.getClass()?.name;
    this.handler = context.getHandler()?.name;

    return this;
  }

  /**
   * Set Request User
   *
   * @description used in Guard
   * @param user Express.Request.user
   */
  setUser(user?: object) {
    this.user = user;

    return this;
  }

  /**
   * Set Response
   *
   * @description used in Interceptor(outgoing)
   * @param res: Express.Response
   */
  setResponse(res: Response) {
    const [message, status] = Object.entries(HttpStatus).find(([, v]) => v === res.statusCode) ?? [-1, ''];

    this.message = String(message);
    this.status = Number(status);

    return this.end();
  }

  /**
   * Set Exception
   *
   * @description used in Filter
   * @param exception HttpException
   * @param error Error
   */
  setException(exception: HttpException, error?: Error) {
    this.message = exception.name;
    this.status = exception.getStatus();
    this.exception = exception;

    if (error) {
      this.error = { name: error.name, message: error.message, stack: error.stack };
    }

    return this.end();
  }

  /**
   * Set Error
   *
   * @description used in Filter
   * @param error Error
   */
  setError(error: Error) {
    this.exception = new InternalServerErrorException(error);
    this.message = this.exception.name;
    this.status = this.exception.getStatus();
    this.error = { name: error.name, message: error.message, stack: error.stack };

    return this.end();
  }
}
