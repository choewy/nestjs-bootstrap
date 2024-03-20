import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('error')
  throwError() {
    return this.appService.throwError();
  }

  @Get('exception')
  throwException() {
    return this.appService.throwException();
  }
}
