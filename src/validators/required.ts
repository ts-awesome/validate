import {isDefined, validators} from 'validate.js';

import {IModelValidationOptions, ValidatorFunction, ValidatorInstance, ValidatorOptions} from "../interfaces";

validators.required = ((value, options, key, attributes, globalOptions: IModelValidationOptions) => {
  if (globalOptions.requireRequired !== false && !isDefined(value)) {
    return options.message ?? "is required";
  }
}) as ValidatorFunction;

export function required(options?: ValidatorOptions<{}>): ValidatorInstance<'required'> {
  return {required: options ?? true};
}
