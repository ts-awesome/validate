import {ValidatorInstance, ValidatorOptions} from "../interfaces";

export function email(options?: ValidatorOptions<{}>): ValidatorInstance<'email'> {
  return {email: options ?? true};
}
