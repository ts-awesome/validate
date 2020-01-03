import {validators} from 'validate.js';

import {IModelValidationOptions, ValidatorFunction, ValidatorInstance, ValidatorOptions} from "../interfaces";

validators.primary = ((value, options, key, attributes, globalOptions: IModelValidationOptions) => {
  if (globalOptions.requirePrimary !== false && value == null) {
    return "is required";
  }
}) as ValidatorFunction;

export function primary(options?: ValidatorOptions<{}>): ValidatorInstance<'primary'> {
  return {primary: options ?? true};
}
