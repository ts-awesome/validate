import {ValidatorInstance, ValidatorOptions} from "../interfaces";

export interface PresenceOptions {
  allowEmpty?: boolean;
}

export function presence(options?: ValidatorOptions<PresenceOptions>): ValidatorInstance<'presence'> {
  return {presence: options ?? true}
}
