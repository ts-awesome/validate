import {validators} from 'validate.js';
import {ValidatorFunction, ValidatorInstance, ValidatorOptions} from "../interfaces";

validators.not_nullable = ((value) => {
  if (value === null) {
    return 'Null is not allowed';
  }
  return;
}) as ValidatorFunction;

export function notNull(options?: ValidatorOptions<{}>): ValidatorInstance<'not_nullable'> {
  return {not_nullable: options ?? true};
}
