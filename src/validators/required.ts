import {Validator, ValidatorOptions} from "../interfaces";
import {error, isDefined} from "./utils";

export function required(options: ValidatorOptions<Record<string, never>> = {}): Validator {
  const {
    message,
    ...validatorOptions
  } = options;

  return function RequiredValidator(value, key, attributes, globalOptions): undefined | string {
    if (globalOptions.requireRequired !== false && !isDefined(value)) {
      return error(message, "is required", {value, key, validatorOptions, attributes, globalOptions, validator: 'required'});
    }
  }
}
