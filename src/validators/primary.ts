import {validators, isDefined} from 'validate.js';

import {IModelValidationOptions, ValidatorFunction, ValidatorInstance, ValidatorOptions} from "../interfaces";

validators.primary = ((value, options, key, attributes, globalOptions: IModelValidationOptions) => {
  if (globalOptions.requirePrimary !== false && !isDefined(value)) {
    return options.message ?? "is required";
  }
}) as ValidatorFunction;

export function primary(options?: ValidatorOptions<{}>): ValidatorInstance<'primary'> {
  return {primary: options ?? true};
}
