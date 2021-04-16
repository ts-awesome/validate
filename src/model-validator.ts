import {ConstructorOf, IEntityValidationMeta, IModelValidationOptions, IValidator, Validator} from "./interfaces";
import {ValidationMetaSymbol} from "./decorators";

import {multi} from "./utils";

export class ModelValidator<T extends Record<string, unknown>> implements IValidator<T> {

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
