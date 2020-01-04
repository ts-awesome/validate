import {validators} from 'validate.js';
import {ValidatorFunction, ValidatorInstance, ValidatorOptions} from "../interfaces";

validators.alpha_num = ((value, options) => {
  if (value?.match(/[!@#$%^&*(),.?":{}|<>\s]/)) {
    return options.message ?? `should be alphanumeric`;
  }
  return;
}) as ValidatorFunction;

export function alphaNumeric(options?: ValidatorOptions<{}>): ValidatorInstance<'alpha_num'> {
  return {alpha_num: options ?? true};
}




