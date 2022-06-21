import type { ArgumentMetadata, ValidationPipeOptions } from '@nestjs/common';
import {
  Injectable,
  UnprocessableEntityException,
  ValidationPipe as VP,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class ValidationPipe extends VP {
  constructor(options: ValidationPipeOptions) {
    super(options);
  }

  private errs = [];
  async transform(value: any, metadata: ArgumentMetadata): Promise<unknown> {
    const obj = plainToInstance(metadata.metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      this.errs = [];
      this.formateErrors(errors);
      throw new UnprocessableEntityException({
        errors: this.errs,
      });
    }

    return value;
  }

  private formateErrors(errors: ValidationError[]) {
    for (const { children, constraints: info, property } of errors) {
      if (children?.length) {
        this.formateErrors(children);
      } else {
        this.errs.push({
          message: info ? Object.values(info).join(', ') : '',
          field: property,
        });
      }
    }
  }
}
