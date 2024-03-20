import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationException extends HttpException {
  constructor(errors: ValidationError[]) {
    const error = errors.shift();
    const message = Object.values(error?.constraints ?? {}).shift();

    super(HttpException.createBody(message, ValidationError.name, HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST, {
      cause: error,
    });
  }
}
