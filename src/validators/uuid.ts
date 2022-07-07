import isValid = require('uuid-validate');
import {Validator, ValidatorOptions} from "../interfaces";
import {error, isDefined, isString} from "./utils";

export type UuidVersion = 1 | 2 | 3 | 4 | 5;

export interface UuidOptions {
  version?: UuidVersion | readonly UuidVersion[];
}

export function uuid(version?: UuidVersion): Validator;
export function uuid(options?: ValidatorOptions<UuidOptions>): Validator;
export function uuid(options: ValidatorOptions<UuidOptions> | UuidVersion = {}): Validator {
  const {
    message,
    version = 4,
    ...validatorOptions
  }: ValidatorOptions<UuidOptions> = typeof options === 'number' ? {version: options} : options

  return function UUIDValidator(value, key, attributes, globalOptions): undefined | string {
    if (!isDefined(value)) {
      return;
    }

    if (!isString(value)) {
      return error(message, "must be a string", {value, key, validatorOptions, attributes, globalOptions, validator: 'uuid'});
    }

    if (typeof version === 'number') {
      if (!isValid(value, version)) {
        return error(message, "is not valid uuid of version %{version}", {
          value,
          key,
          validatorOptions,
          attributes,
          globalOptions,
          validator: 'uuid',
          version
        });
      }
    } else if (Array.isArray(version)) {
      if (version.every((v) => !isValid(value, v))) {
        return error(message, "is not valid uuid of versions %{version}", {
          value,
          key,
          validatorOptions,
          attributes,
          globalOptions,
          validator: 'uuid',
          version: version.join(',')
        });
      }
    }
  }
}
