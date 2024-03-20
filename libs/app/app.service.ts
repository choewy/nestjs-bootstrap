import { Injectable } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { v4 } from 'uuid';

import { ValidationException } from '../implements';

@Injectable()
export class AppService {
  getHello() {
    return 'hello';
  }

  throwException() {
    throw new ValidationException([new ValidationError()]);
  }

  throwError() {
    throw new Error(v4());
  }
}
