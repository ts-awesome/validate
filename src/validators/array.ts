import {validators, isDefined, isArray, single} from 'validate.js';
import {ValidationMeta, ValidatorFunction, ValidatorInstance, ValidatorOptions} from "../interfaces";
import {LengthOptions} from "./length";

validators.array = ((value, options) => {
  // Empty values are allowed. Use presence validator along with this validator for required array property.
  // Although note that presence validator considers and empty array as 'not present'.
  if (!isDefined(value)) {
    return;
  }

  // Finally validate the value
  if (!isArray(value)) {
    return options.message ?? options.notValid ?? "must be an array";
  }

  if (options.length !== undefined) {
    const errors = single(value, options.length);
    if (errors !== undefined) {
      return options.message ?? options.notValidLength ?? `length ${errors.toString()}`;
    }
  }

  if (options.element !== undefined) {
    for (let element of value) {
      const errors = single(element, options.element);
      if (errors !== undefined) {
        return  options.message ?? options.notValidElement ?? `element ${errors.toString()}`;
      }
    }
  }
}) as ValidatorFunction;

export interface ArrayOptions {
  length?: Omit<LengthOptions<any>, 'tokenizer'>;
  element?: ValidationMeta;

  notValid?: string;
  notValidLength?: string;
  notValidElement?: string;
}

export function array(options?: ValidatorOptions<ArrayOptions>): ValidatorInstance<'array'> {
  return {array: options ?? true};
}
