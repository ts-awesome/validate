import {Validator, ValidatorOptions} from "../interfaces";
import {
  error,
  isArray,
  isBoolean,
  isDate,
  isDefined,
  isFunction,
  isInteger, isNumber,
  isObject,
  isString,
} from "./utils";

export interface TypeChecker {
  (
    value: unknown,
    attribute: string,
    validatorOptions: Readonly<Record<string, unknown>>,
    attributes: Readonly<Record<string, unknown>>,
    globalOptions: Readonly<Record<string, unknown>>,
  ): boolean;
}

const types: Record<string, TypeChecker> = {
  object: value => isObject(value) && !isArray(value) && !isFunction(value),
  array: isArray,
  integer: isInteger,
  number: isNumber,
  string: isString,
  date: isDate,
  boolean: isBoolean
};

export type TypeValue = 'object' | 'array' | 'integer' | 'number' | 'string' | 'date' | 'boolean' | TypeChecker;

export interface TypeOptions {
  type: TypeValue;
}

export function type(type: TypeValue): Validator;
export function type(options: ValidatorOptions<TypeOptions>): Validator;
export function type(options: ValidatorOptions<TypeOptions> | TypeValue): Validator {
  const {
    message,
    type,
    ...validatorOptions
  }: ValidatorOptions<TypeOptions> = isFunction(options) || isString(options) ? {type: options} : options;

  if (!isDefined(type)) {
    throw new Error("No type was specified");
  }

  const check = isFunction(type) ? type : types[type];

  if (!isFunction(check)) {
    throw new Error("Unknown type " + type + ".");
  }

  return function TypeValidator(value, key, attributes, globalOptions): undefined | string {
    if (!isDefined(value)) {
      return;
    }

    if (!check(value, key, validatorOptions, attributes, globalOptions)) {
      return error(message, "must be of the correct type %{type}",
        {value, key, validatorOptions, attributes, globalOptions, validator: 'primary', type: isFunction(type) ? (type.name || 'anonymous') : type });
    }
  }
}
