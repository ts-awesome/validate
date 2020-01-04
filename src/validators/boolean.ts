import {validators, isDefined, isBoolean} from 'validate.js';
import {ValidatorFunction, ValidatorInstance, ValidatorOptions} from "../interfaces";

validators.boolean = ((value, options, key) => {
  // First validate the configuration of this validator
  if (options.equalTo !== undefined && !isBoolean(options.equalTo)) {
    throw new Error(
      `boolean validator for ${key} misconfigured. \'equalTo\' must be a boolean`
    );
  }

  // Empty values are allowed. Use presence validator along with this validator for required boolean property.
  if (!isDefined(value)) {
    return;
  }

  // Finally validate the value
  if (!isBoolean(value)) {
    return options.message ?? "must be a boolean";
  }

  if (options.equalTo !== undefined && value !== options.equalTo) {
    return options.message ?? `must be ${options.equalTo}`;
  }
}) as ValidatorFunction;

export interface BooleanOptions {
  equalTo?: boolean;
}

export function boolean(options?: boolean): ValidatorInstance<'boolean'>;
export function boolean(options?: ValidatorOptions<BooleanOptions>): ValidatorInstance<'boolean'>;
export function boolean(options?: ValidatorOptions<BooleanOptions> | boolean): ValidatorInstance<'boolean'> {
  return {boolean: isBoolean(options) ? {equalTo: options} : (options ?? true)};
}
