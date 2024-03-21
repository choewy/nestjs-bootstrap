import { ExecutionContext, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { WinstonLogger } from 'nest-winston';

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
  exception?: object | string;
  exceptionCause?: unknown;
  error?: object;

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
    if (typeof this.latency === 'number') {
      return this;
    }

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
   * @description used in Interceptor(outgoing, tap)
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
  setException(exception: HttpException) {
    this.message = exception.name;
    this.status = exception.getStatus();
    this.exception = exception.getResponse();
    this.exceptionCause = exception.cause;

    return this.end();
  }

  /**
   * Set Error
   *
   * @description used in Filter
   * @param error Error
   */
  setError(error: Error) {
    this.error = { name: error.name, message: error.message, stack: error.stack };

    return this.end();
  }

  /**
   * Get Logger Method Args
   *
   * @description used in Interceptor(outgoing, catchError)
   * @param error Error
   */
  getArgs<T = [unknown]>(): T {
    const staticInstanceRef = Logger['staticInstanceRef'];

    if (staticInstanceRef instanceof WinstonLogger) {
      return [this] as T;
    }

    const args = [
      JSON.stringify(
        {
          ...this,
          context: undefined,
          handler: undefined,
          error: undefined,
        },
        null,
        2,
      ),
    ];

    if (this.error) {
      args.push(this.error['stack']);
    }

    args.push([this.context, this.handler].join('.'));

    return args as T;
  }
}
