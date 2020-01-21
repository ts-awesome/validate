import {validators} from 'validate.js';
import {ValidatorFunction, ValidatorInstance, ValidatorOptions} from "../interfaces";

export interface AlphaNumProps {
  allowSpaces?: boolean
}

validators.alpha_num = ((value, options) => {
  if (value?.match(/[!@#$%^&*(),.?":{}|<>]/)) {
    return options.message ?? `should be alphanumeric`;
  }
  if (options.allowSpaces === false && /\s/.test(value)) {
    return options.message ?? `should be alphanumeric`;
  }
}) as ValidatorFunction;

export function alphaNumeric(allowSpaces: boolean): ValidatorInstance<'alpha_num'>;
export function alphaNumeric(options?: ValidatorOptions<AlphaNumProps>): ValidatorInstance<'alpha_num'>;
export function alphaNumeric(options?: ValidatorOptions<AlphaNumProps> | boolean): ValidatorInstance<'alpha_num'> {
  return {alpha_num: typeof options === 'boolean' ? {allowSpaces: options} : options ?? true};
}




