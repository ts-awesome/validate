import {validators} from 'validate.js';

import {IModelValidationOptions, ValidatorFunction, ValidatorInstance, ValidatorOptions} from "../interfaces";

validators.required = ((value, options, key, attributes, globalOptions: IModelValidationOptions) => {
  if (globalOptions.requireRequired !== false && value == null) {
    return "is required";
  }
}) as ValidatorFunction;

export interface RequiredOptions {
  allowEmpty?: boolean;
}

export function required(options?: ValidatorOptions<RequiredOptions>): ValidatorInstance<'required'> {
  return {required: options ?? true};
}
