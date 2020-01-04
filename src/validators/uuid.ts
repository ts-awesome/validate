import isValid = require('uuid-validate');
import {validators, isDefined, format} from 'validate.js';
import {ValidatorFunction, ValidatorInstance, ValidatorOptions} from "../interfaces";

validators.uuid = ((value, options) => {
  if (!isDefined(value)) {
    return;
  }

  const version = options.version ?? 4;
  if (!isValid(value, version)) {
    return format(options.message ?? `is invalid uuid version ${version}`, {version});
  }
}) as ValidatorFunction;

export type UuidVersion = 1 | 2 | 3 | 4 | 5;

export interface UuidOptions {
  version?: UuidVersion;
}

export function uuid(version?: UuidVersion): ValidatorInstance<'uuid'>;
export function uuid(options?: ValidatorOptions<UuidOptions>): ValidatorInstance<'uuid'>;
export function uuid(options?: ValidatorOptions<UuidOptions> | UuidVersion): ValidatorInstance<'uuid'> {
  return {uuid: typeof options === 'number' ? {version: options} : (options ?? true)};
}
