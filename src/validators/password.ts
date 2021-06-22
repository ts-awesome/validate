import {Validator, ValidatorOptions} from "../interfaces";
import {error, isDefined} from "./utils";

/**
 * PasswordProps interface
 */
export interface PasswordProps {
  /**
   * complexity?
   */
  complexity?: 'low'|'medium'|'strong'
}

/**
 * password validator checks if provide value has no special chars: !@#$%^&*(),.?":{}|<>]
 */
export function password(complexity?: 'low'|'medium'|'strong'): Validator;

/**
 * password validator checks if provide value has no special chars: !@#$%^&*(),.?":{}|<>]
 */
export function password(options?: ValidatorOptions<PasswordProps>): Validator;

export function password(o?: ValidatorOptions<PasswordProps> | 'low'|'medium'|'strong'): Validator {
  const {message, complexity = 'strong', ...validatorOptions}: ValidatorOptions<PasswordProps> = typeof o === 'string' ? {complexity: o} : o ?? {};

  return function PasswordValidator(value, key, attributes, globalOptions): undefined | string {
    // Empty values are allowed. Use presence validator along with this validator for required boolean property.
    if (!isDefined(value)) {
      return;
    }

    if (typeof value !== 'string') {
      return error(message, "must be string", {value, key, validatorOptions, attributes, globalOptions, validator: 'password'});
    }

    if (!isStrongPassword(value, complexity)) {
      return error(message, "is too simple", {value, key, validatorOptions, attributes, globalOptions, validator: 'password'});
    }
  }
}

function isStrongPassword(candidate: string, complexity: 'low'|'medium'|'strong' = 'strong'): boolean {
  const p = candidate?.trim() ?? '';
  if (p.length < 8 || p.length > 63) {
    return false;
  }

  // should have at least one lower case letter
  if (!/[a-z]/.test(p)) {
    return false;
  }

  // should have at least one digit
  if (!/[0-9]/.test(p) && complexity !== 'low') {
    return false;
  }

  // should have at least one upper case letter
  if (!/[A-Z]/.test(p) && complexity !== 'low') {
    return false;
  }

  // should have at least one special char
  if (complexity === 'strong' && /^[0-9a-zA-Z]*$/.test(p)) {
    return false;
  }

  return true;
}
