import {IValidator, ISingleValidationOptions, Validator} from "./interfaces";
import {single} from "./utils";
import {notNull, presence} from "./validators";

export class SingleValidator<T> implements IValidator<T> {
  constructor(private constraint: Validator[]) {}

  validate(value: T, options?: ISingleValidationOptions): true | readonly string[] {
    const constraint = [...this.constraint];
    if (options?.required) {
      constraint.push(presence({allowEmpty: !options.notNullable}));
    }
    if (options?.notNullable) {
      constraint.push(notNull());
    }

    return single<T>(value, ...constraint);
  }
}
