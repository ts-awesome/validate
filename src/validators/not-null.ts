import {Validator, ValidatorOptions} from "../interfaces";
import {error, isDefined} from "./utils";

export function notNull(options: ValidatorOptions<Record<string, never>> = {}): Validator {

  const {
    message,
    ...validatorOptions
  } = options;

  return function NotNullValidator(value, key, attributes, globalOptions): undefined | string {
    if (!isDefined(value)) {
      return
    }

    if (value === null) {
      return error(message, "should not be null", {value, key, validatorOptions, attributes, globalOptions, validator: 'notNull'});
    }
  }
}
