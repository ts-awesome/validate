import {validators} from 'validate.js';
import {ValidatorFunction, ValidatorInstance, ValidatorOptions} from "../interfaces";

validators.not_nullable = ((value, options) => {
  if (value === null) {
    return options.message ?? 'should be not null';
  }
  return;
}) as ValidatorFunction;

export function notNull(options?: ValidatorOptions<{}>): ValidatorInstance<'not_nullable'> {
  return {not_nullable: options ?? true};
}
