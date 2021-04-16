// Checks if the value is a number. This function does not consider NaN a
// number like many other `isNumber` functions do.
import {GlobalOptions, MessageFormatter} from "../interfaces";

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

// Returns false if the object is not a function
export function isFunction<T = unknown>(value: unknown): value is ((...args: unknown[]) => T) {
  return typeof value === 'function';
}

// A simple check to verify that the value is an integer. Uses `isNumber`
// and a simple modulo check.
export function isInteger(value: unknown): value is number {
  return isNumber(value) && value % 1 === 0;
}

// Checks if the value is a boolean
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

// Uses the `Object` function to check if the given argument is an object.
export function isObject(obj: unknown): obj is Record<string, unknown> {
  return obj === Object(obj);
}

export function isArray(x: unknown): x is readonly unknown[] {
  return Array.isArray(x);
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// Simply checks if the object is an instance of a date
export function isDate(obj: unknown): obj is Date {
  return obj instanceof Date;
}

// Returns false if the object is `null` of `undefined`
export function isDefined(obj: unknown): boolean {
  return obj !== null && obj !== undefined;
}

export function capitalize(str: string): string {
  return isString(str) ? str[0].toUpperCase() + str.slice(1) : str;
}

// "Prettifies" the given string.
// Prettifying means replacing [.\_-] with spaces as well as splitting
// camel case words.
export function prettify(value: unknown): string {
  if (isNumber(value)) {
    // If there are more than 2 decimals round it to two
    return (value * 100) % 1 === 0 ? "" + value : (Math.round(value * 100) / 100).toFixed(2);
  }

  if (isArray(value)) {
    return value.map(prettify).join(", ");
  }

  if (isObject(value)) {
    return value.toString?.() ?? JSON.stringify(value);
  }

  return ("" + value)
    // Splits keys separated by periods
    .replace(/([^\s])\.([^\s])/g, '$1 $2')
    // Removes backslashes
    .replace(/\\+/g, '')
    // Replaces - and - with space
    .replace(/[_-]/g, ' ')
    // Splits camel cased words
    .replace(/([a-z])([A-Z])/g, (m0, m1, m2) => `${m1} ${m2.toLowerCase()}`)
    .toLowerCase();
}

export function tpl(value: string, obj: Record<string, unknown> = {}): string {
  // return new Function('__obj', `with(__obj) { return \`${tpl ?? ''}\`; }`)(obj);
  return (value?.toString?.() ?? '').replace(/%{([a-z][0-9a-z_-]+)}/gi,
    (substring, name) => Object.prototype.hasOwnProperty.call(obj, name) ? '' + obj[name] : substring);
}

export function isEmpty(value: unknown): boolean {
  return !isDefined(value) ? true :
    isFunction(value) ? false :
      isString(value) ? value.trim().length === 0 :
        isArray(value) ? value.length === 0 :
          isDate(value) ? false :
            isObject(value) ? Object.keys(value).length === 0 :
              false;
}

export interface ErrorOptions {
  value: unknown;
  key: string;
  validator: string;
  validatorOptions: Readonly<Record<string, unknown>>,
  attributes: Readonly<Record<string, unknown>>,
  globalOptions: Readonly<GlobalOptions>

  [key: string]: unknown;
}

export function error(message: undefined | string | MessageFormatter<unknown>, def: string, opts: Readonly<ErrorOptions>): string {
  const {value, attributes, globalOptions, key, validatorOptions, ...extra} = opts;
  if (isFunction(message)) {
    return message(value, key, validatorOptions, attributes, globalOptions, extra);
  }

  return tpl(message ?? def, opts);
}
