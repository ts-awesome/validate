import {IValidator, ISingleValidationOptions, ValidationMeta} from "./interfaces";
import {single} from 'validate.js';
import {Container} from "inversify";
import {prepare} from "./utils";
import {notNull, presence} from "./validators";

export class SingleValidator<T> implements IValidator<T> {
  constructor(private kernel: Container, private constraint: ValidationMeta) {}

  validate(value: T, options?: ISingleValidationOptions): true | string[] {
    let constraint = prepare(this.constraint, this.kernel);
    if (options?.required) {
      constraint = {
        ...constraint,
        ...presence({allowEmpty: !options.notNullable}),
      }
    }
    if (options?.notNullable) {
      constraint = {
        ...constraint,
        ...notNull(),
      }
    }

    const result = single(value, constraint);

    if (result !== undefined) {
      return Array.isArray(result) ? result : [result];
    }

    return true;
  }
}
