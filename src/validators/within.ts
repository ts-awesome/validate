import {ValidatorInstance, ValidatorOptions} from "../interfaces";

export type WithinType<T extends string | number> = ReadonlyArray<T> | Iterable<T> | Record<T, string>;

export interface WithinOptions<T extends string | number> {
  within: WithinType<T>;
}

export function exclusion<T extends string | number = string>(within: WithinType<T>): ValidatorInstance<'exclusion'>;
export function exclusion<T extends string | number = string>(options: ValidatorOptions<WithinOptions<T>>): ValidatorInstance<'exclusion'>;
export function exclusion<T extends string | number = string>(options: ValidatorOptions<WithinOptions<T>> | WithinType<T>): ValidatorInstance<'exclusion'> {
  return {exclusion: Array.isArray(options) ? {within: options} : options }
}

export function inclusion<T extends string | number = string>(within: WithinType<T>): ValidatorInstance<'inclusion'>;
export function inclusion<T extends string | number = string>(options: ValidatorOptions<WithinOptions<T>>): ValidatorInstance<'inclusion'>;
export function inclusion<T extends string | number = string>(options: ValidatorOptions<WithinOptions<T>> | WithinType<T>): ValidatorInstance<'inclusion'> {
  return {inclusion: Array.isArray(options) ? {within: options} : options }
}
