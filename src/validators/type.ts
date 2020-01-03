import {ValidatorInstance, ValidatorOptions} from "../interfaces";

export interface TypeChecker {
  (value: any): boolean;
}

export type TypeValue = 'object' | 'array' | 'integer' | 'number' | 'string' | 'date' | 'boolean' | TypeChecker;

export interface TypeOptions {
  type: TypeValue;
}

export function type(type: TypeValue): ValidatorInstance<'type'>;
export function type(options: ValidatorOptions<TypeOptions>): ValidatorInstance<'type'>;
export function type(options: ValidatorOptions<TypeOptions> | TypeValue): ValidatorInstance<'type'> {
  return {type: typeof options === 'object' ? options : {type: options}};
}
