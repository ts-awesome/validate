import {Validator, ValidatorOptions} from "../interfaces";
import {error, isDefined, isEmpty} from "./utils";

export interface PresenceOptions {
  allowEmpty?: boolean;
}

export function presence(options: ValidatorOptions<PresenceOptions> = {}): Validator {
  const {
    message,
    allowEmpty,
    ...validatorOptions
  } = options;

  return function PresenceValidator(value, key, attributes, globalOptions): undefined | string {
    if (allowEmpty !== false ? !isDefined(value) : isEmpty(value)) {
      return error(message, "can't be blank", {value, key, validatorOptions, attributes, globalOptions, validator: 'presence'});
    }
  }
}
