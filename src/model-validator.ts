import {ConstructorOf, IEntityValidationMeta, IModelValidationOptions, IValidator, Validator} from "./interfaces";
import {ValidationMetaSymbol} from "./decorators";

import {multi} from "./utils";

// suppress unit TS bug is fixed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ModelValidator<T extends Record<string, any>> implements IValidator<T> {

  private readonly metadata: IEntityValidationMeta;

  constructor(Model: ConstructorOf<T>) {
    this.metadata = Model.prototype[ValidationMetaSymbol];
  }

  validate(value: T, options: IModelValidationOptions = {}): true | readonly string[] {
    return multi(value, this.metadata, this.getConstraint<T>(), options);
  }

  private getConstraint<T>(): Record<keyof T, readonly Validator[]> {
    const res = {} as Record<keyof T, readonly Validator[]>;
    this.metadata.fields.forEach((meta, property) => {
      res[property.toString()] = meta;
    });

    return res;
  }
}
