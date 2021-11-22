import {Validator, ValidatorOptions} from "../interfaces";
import {error, isDefined} from "./utils";

/**
 * PasswordProps interface
 */
export interface PasswordProps {
  /**
   * complexity?
   */
  complexity?: 'low'|'weak'|'medium'|'strong'
}

/**
 * password validator checks if provide value has no special chars: !@#$%^&*(),.?":{}|<>]
 */
export function password(complexity?: 'low'|'weak'|'medium'|'strong'): Validator;

/**
 * password validator checks if provide value has no special chars: !@#$%^&*(),.?":{}|<>]
 */
export function password(options?: ValidatorOptions<PasswordProps>): Validator;

export function password(o?: ValidatorOptions<PasswordProps> | 'low'|'weak'|'medium'|'strong'): Validator {
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

/**
 * @param {string} candidate
 * @param {string} complexity 'low'|'weak'|'medium'|'strong'
 * @param {number} minlength
 * @return {boolean}
 */
export function isStrongPassword(candidate: string, complexity: 'low'|'weak'|'medium'|'strong' = 'strong', minlength = 8): boolean {
  const p = candidate?.trim() ?? '';
  if (p.length < Math.max(minlength, 8) || p.length > 63) {
    return false;
  }

  return PASSWORD_COMPLEXITY_INDEX[getPasswordComplexity(p)] >= (PASSWORD_COMPLEXITY_INDEX[complexity] ?? PASSWORD_COMPLEXITY_INDEX['strong']);
}

const PASSWORD_COMPLEXITY_INDEX = {'low': 0, 'weak': 1, 'medium': 2, 'strong': 3, 'extra-strong': 4};

/**
 * @param {string} p
 * @return {string} 'none'|'low'|'weak'|'medium'|'strong'|'extra-strong'
 */
export function getPasswordComplexity(p: string): 'none'|'low'|'weak'|'medium'|'strong'|'extra-strong' {
  if (!p || /^[0-9]*$/.test(p)) {
    return 'none';
  }

  if (p.length >= 12 && isStrong(p)) {
    return 'extra-strong';
  }

  if (isStrong(p)) {
    return 'strong';
  }

  if (isMedium(p)) {
    return 'medium';
  }

  if (isWeak(p)) {
    return 'weak';
  }

  return 'low';
}

function hasLetter(p: string): boolean {
  return /[a-z]/i.test(p)
}

function hasLower(p: string): boolean {
  return /[a-z]/.test(p)
}

function hasUpper(p: string): boolean {
  return /[A-Z]/.test(p)
}

function hasDigit(p: string): boolean {
  return /[0-9]/.test(p)
}

function hasSpecial(p: string): boolean {
  return /[^0-9a-zA-Z]/.test(p)
}

function hasSpecialOrDigit(p: string): boolean {
  return hasDigit(p) || hasSpecial(p);
}

function isStrong(p: string): boolean {
  return hasLower(p) && hasUpper(p) && hasDigit(p) && hasSpecial(p);
}

function isMedium(p: string): boolean {
  return hasLower(p) && hasUpper(p) && hasSpecialOrDigit(p);
}

function isWeak(p: string): boolean {
  return hasLetter(p) && hasSpecialOrDigit(p) || hasLower(p) && hasUpper(p);
}
