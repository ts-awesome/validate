import {ValidatorInstance, ValidatorOptions} from "../interfaces";

export interface PatternOptions {
  pattern: RegExp | string;
  flags?: 'i' | 'g' | 'gi';
}

export function format(pattern: RegExp): ValidatorInstance<'format'>;
export function format(options: ValidatorOptions<PatternOptions>): ValidatorInstance<'format'>;
export function format(options: ValidatorOptions<PatternOptions> | RegExp): ValidatorInstance<'format'> {
  return {format: options instanceof RegExp ? {pattern: options} : options};
}
