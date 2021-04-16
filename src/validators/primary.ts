import {Validator, ValidatorOptions} from "../interfaces";
import {error, isDefined} from "./utils";

export function primary(options: ValidatorOptions<Record<string, never>> = {}): Validator {
  const {
    message,
    ...validatorOptions
  } = options;

  return function PrimaryValidator(value, key, attributes, globalOptions): undefined | string {
    if (globalOptions.requirePrimary !== false && !isDefined(value)) {
      return error(message, "is required", {value, key, validatorOptions, attributes, globalOptions, validator: 'primary'});
    }
  }
}
