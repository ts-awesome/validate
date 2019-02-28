import {IValidator} from "./interfaces";
import {single} from 'validate.js';
import {Container} from "inversify";
import Symbols from './symbols';

export class SingleValidator<T> implements IValidator<T> {
  constructor(private kernel: Container, private type: string) {}

  validate(value: T): true | string[] {
    return single(value, this.kernel.getNamed(Symbols.Constraint, this.type)) === undefined ? true : [];
  }
}
