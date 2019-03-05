import {IValidator, ISingleValidationOptions} from "./interfaces";
import {single} from 'validate.js';
import {Container} from "inversify";
import Symbols from './symbols';

export class SingleValidator<T> implements IValidator<T> {
  constructor(private kernel: Container, private type: string) {}

  validate(value: T, options?: ISingleValidationOptions): true | string[] {
    let constraint: any = {
      ...this.kernel.getNamed(Symbols.Constraint, this.type)
    };
    if (options && options.required) {
      constraint.presence = true;
    }
    if(options && options.notNullable) {
      constraint.not_nullable = true
    }
    return single(value, constraint) === undefined ? true : [];
  }
}
