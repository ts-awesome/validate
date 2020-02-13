import {isDefined, validators} from 'validate.js';
import {ValidatorFunction, ValidatorInstance, ValidatorOptions} from "../interfaces";

export interface AlphaNumProps {
  allowSpaces?: boolean
}

validators.alpha_num = ((value, options) => {
  // Empty values are allowed. Use presence validator along with this validator for required boolean property.
  if (!isDefined(value)) {
    return;
  }

  if (typeof value !== 'string') {
    return options.message ?? "must be string";
  }

  if (value?.match(/[!@#$%^&*(),.?":{}|<>]/)) {
    return options.message ?? `must be alphanumeric`;
  }

  if (options.allowSpaces === false && /\s/.test(value)) {
    return options.message ?? `must be alphanumeric without spaces`;
  }
}) as ValidatorFunction;

export function alphaNumeric(allowSpaces: boolean): ValidatorInstance<'alpha_num'>;
export function alphaNumeric(options?: ValidatorOptions<AlphaNumProps>): ValidatorInstance<'alpha_num'>;
export function alphaNumeric(options?: ValidatorOptions<AlphaNumProps> | boolean): ValidatorInstance<'alpha_num'> {
  return {alpha_num: typeof options === 'boolean' ? {allowSpaces: options} : options ?? true};
}




