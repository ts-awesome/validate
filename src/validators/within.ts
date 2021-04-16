import {Validator, ValidatorOptions} from "../interfaces";
import {error, isArray, isDefined, isString} from "./utils";

function contains(obj: readonly unknown[] | Record<string, unknown>, value: unknown): boolean {
  return !isDefined(obj) ? false : isArray(obj) ? obj.indexOf(value) !== -1 : isString(value) ? value in obj : false;
}

export type WithinType<T extends string | number> = readonly T[];

export interface WithinOptions<T extends string | number> {
  within: WithinType<T>;
}

export function exclusion<T extends string | number = string>(within: WithinType<T>): Validator;
export function exclusion<T extends string | number = string>(options: ValidatorOptions<WithinOptions<T>>): Validator;
export function exclusion<T extends string | number = string>(options: ValidatorOptions<WithinOptions<T>> | WithinType<T>): Validator {
  const {
    message,
    within,
    ...validatorOptions
  }: ValidatorOptions<WithinOptions<T>> = isArray(options) ? {within: options} : options

  return function InclusionValidator(value, key, attributes, globalOptions): undefined | string {
    // Empty values are fine
    if (!isDefined(value)) {
      return;
    }

    if (contains(within, value)) {
      return error(message, "value (%{value}) is forbidden", {value, key, validatorOptions, attributes, globalOptions, validator: 'inclusion'});
    }
  }
}

export function inclusion<T extends string | number = string>(within: WithinType<T>): Validator;
export function inclusion<T extends string | number = string>(options: ValidatorOptions<WithinOptions<T>>): Validator;
export function inclusion<T extends string | number = string>(options: ValidatorOptions<WithinOptions<T>> | WithinType<T>): Validator {
  const {
    message,
    within,
    ...validatorOptions
  }: ValidatorOptions<WithinOptions<T>> = isArray(options) ? {within: options} : options

  return function InclusionValidator(value, key, attributes, globalOptions): undefined | string {
    // Empty values are fine
    if (!isDefined(value)) {
      return;
    }

    if (!contains(within, value)) {
      return error(message, "value (%{value}) is not allowed", {value, key, validatorOptions, attributes, globalOptions, validator: 'inclusion'});
    }
  }
}
