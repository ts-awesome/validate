import {IValidator, ISingleValidationOptions, ValidationMeta, IContainer} from "./interfaces";
import {prepare, single} from "./utils";
import {notNull, presence} from "./validators";

export class SingleValidator<T> implements IValidator<T> {
  constructor(
    private constraint: ValidationMeta,
    private kernel?: IContainer,
  ) {}

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

    return single<T>(value, constraint);
  }
}
