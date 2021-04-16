import {IEntityValidationMeta, Validator, ValidatorOptions} from "../interfaces";
import {error, isDefined, isObject} from "./utils";
import validate from "../utils";
import {ValidationMetaSymbol} from "../decorators";

declare type Class = new (...args: unknown[]) => Record<string, unknown>;

export interface ModelProps {
  model: Class
}

export function model(model: Class): Validator;
export function model(options: ValidatorOptions<ModelProps>): Validator;
export function model(o: ValidatorOptions<ModelProps> | Class): Validator {
  const {
    message,
    model,
    ...validatorOptions
  }: ValidatorOptions<ModelProps> = typeof o === 'function' ? {model: o} : o;

  return function ModelValidator(value, key, attributes, globalOptions): undefined | string | readonly string[] {
    // Empty values are allowed. Use presence validator along with this validator for required boolean property.
    if (!isDefined(value)) {
      return;
    }

    const metadata: IEntityValidationMeta = model.prototype[ValidationMetaSymbol];
    if (metadata) {
      const constraints = {};
      metadata.fields.forEach((meta, property) => {
        constraints[property] = meta;
      });

      if (!isObject(value)) {
        return error(message, "must be an object", {value, key, validatorOptions, attributes, globalOptions, validator: 'model'});
      }

      const results = validate(value, constraints, {...globalOptions, format: 'flat', fullMessages: true});

      return results ? [...results ] : undefined;
    }
  }
}




