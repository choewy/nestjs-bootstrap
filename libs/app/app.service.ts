import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

@Injectable()
export class AppService {
  getHello() {
    return 'hello';
  }

  throwException() {
    throw new BadRequestException();
  }

  throwError() {
    throw new Error(v4());
  }
}
