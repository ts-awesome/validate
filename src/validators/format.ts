import {Validator, ValidatorOptions} from "../interfaces";
import {error, isDefined, isString} from "./utils";

export interface PatternOptions {
  pattern: RegExp | string;
  flags?: 'i' | 'g' | 'gi';
}

export function format(pattern: RegExp | string): Validator;
export function format(options: ValidatorOptions<PatternOptions>): Validator;
export function format(options: ValidatorOptions<PatternOptions> | RegExp | string): Validator {
  let {
    // eslint-disable-next-line prefer-const
    message,
    pattern,
    // eslint-disable-next-line prefer-const
    flags,
    // eslint-disable-next-line prefer-const
    ...validatorOptions
  }: ValidatorOptions<PatternOptions> = options instanceof RegExp || isString(options) ? {pattern: options} : options;

  if (isString(pattern)) {
    pattern = new RegExp(pattern, flags);
  }

  if (!(pattern instanceof RegExp)) {
    throw new Error(`Format expects string pattern or RegExp`)
  }

  return function FormatValidator(value, key, attributes, globalOptions): undefined | string {
    // Empty values are allowed
    if (!isDefined(value)) {
      return;
    }

    if (!isString(value)) {
      return error(message, "must be a string", {value, key, validatorOptions, attributes, globalOptions, validator: 'format'});
    }

    if (isString(pattern)) {
      pattern = new RegExp(pattern, flags);
    }

    const [match] = pattern.exec(value) ?? [];
    if (match?.length !== value.length) {
      return error(message, "is not matching pattern", {value, key, validatorOptions, attributes, globalOptions, validator: 'format'});
    }
  }
}
