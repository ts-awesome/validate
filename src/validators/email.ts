import {Validator, ValidatorOptions} from "../interfaces";
import {error, isDefined, isString} from "./utils";

// eslint-disable-next-line
const PATTERN = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i

export function email(options: ValidatorOptions<Record<string, never>> = {}): Validator {
  const {
    message,
    ...validatorOptions
  } = options;

  return function EmailValidator(value, key, attributes, globalOptions): undefined | string {
    // Empty values are fine
    if (!isDefined(value)) {
      return;
    }

    if (!isString(value)) {
      return error(message, "must be a string", {value, key, validatorOptions, attributes, globalOptions, validator: 'email'});
    }

    if (!PATTERN.exec(value)) {
      return error(message, "should be a valid email", {value, key, validatorOptions, attributes, globalOptions, validator: 'email'});
    }
  }
}
