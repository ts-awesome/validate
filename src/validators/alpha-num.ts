import {Validator, ValidatorOptions} from "../interfaces";
import {error, isDefined} from "./utils";

export interface AlphaNumProps {
  allowSpaces?: boolean
}

export function alphaNumeric(allowSpaces: boolean): Validator;
export function alphaNumeric(options?: ValidatorOptions<AlphaNumProps>): Validator;
export function alphaNumeric(o?: ValidatorOptions<AlphaNumProps> | boolean): Validator {
  const {message, ...validatorOptions}: ValidatorOptions<AlphaNumProps> = typeof o === 'boolean' ? {allowSpaces: o} : o ?? {};

  return function AlphaNumericValidator(value, key, attributes, globalOptions): undefined | string {
    // Empty values are allowed. Use presence validator along with this validator for required boolean property.
    if (!isDefined(value)) {
      return;
    }

    if (typeof value !== 'string') {
      return error(message, "must be string", {value, key, validatorOptions, attributes, globalOptions, validator: 'alphaNumeric'});
    }

    if (value?.match(/[!@#$%^&*(),.?":{}|<>]/)) {
      return error(message, "must be alphanumeric", {value, key, validatorOptions, attributes, globalOptions, validator: 'alphaNumeric'});
    }

    if (validatorOptions.allowSpaces === false && /\s/.test(value)) {
      return error(message, "must be alphanumeric without spaces", {value, key, validatorOptions, attributes, globalOptions, validator: 'alphaNumeric'});
    }
  }
}




