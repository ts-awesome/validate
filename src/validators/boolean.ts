import {Validator, ValidatorOptions} from "../interfaces";
import {error, isBoolean, isDefined} from "./utils";

export interface BooleanOptions {
  equalTo?: boolean;
}

export function boolean(equalTo: boolean): Validator;
export function boolean(options?: ValidatorOptions<BooleanOptions>): Validator;
export function boolean(options: ValidatorOptions<BooleanOptions> | boolean = {}): Validator {
  const {
    message,
    equalTo,
    ...validatorOptions
  }: ValidatorOptions<BooleanOptions> = isBoolean(options) ? {equalTo: options} : options;

  if (equalTo !== undefined && !isBoolean(equalTo)) {
    throw new Error(`Boolean validator expects 'equalTo' must be a boolean value`);
  }

  return function BooleanValidator(value, key, attributes, globalOptions): undefined | string {
    // Empty values are allowed. Use presence validator along with this validator for required boolean property.
    if (!isDefined(value)) {
      return;
    }

    // Finally validate the value
    if (!isBoolean(value)) {
      return error(message,"must be a boolean", {value, key, validatorOptions, attributes, globalOptions, validator: 'boolean'})
    }

    if (equalTo !== undefined && value !== equalTo) {
      return error(message,"must be equal %{equalTo}", {value, key, validatorOptions, attributes, globalOptions, validator: 'boolean', equalTo})
    }
  }
}
