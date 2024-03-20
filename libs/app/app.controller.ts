import { Controller, Get, Param } from '@nestjs/common';

import { AppService } from './app.service';
import { ValidateDto } from './dtos';

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

  @Get('validate/:id')
  validate(@Param() param: ValidateDto) {
    return param;
  }
}
