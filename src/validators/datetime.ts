import {format as datetimeFormat, isAfter, isBefore, parse} from 'date-fns';
import {MessageFormatter, Validator, ValidatorOptions} from "../interfaces";
import {error, isDate, isDefined, isFunction, isString} from "./utils";

function toDate(date: string | Date | DateProvider, tpl: string, ...args: unknown[]): Date {
  if (isFunction<Date>(date)) {
    date = date(...args);

    if (!isString(date) && !isDate(date)) {
      throw new Error(`DateProvider expected to return a date string or Date instance`);
    }
  }

  const value = isDate(date) ? datetimeFormat(date, tpl) : date.toString();
  return parse(value, tpl, new Date);
}

interface DateProvider {
  (
    key: string,
    validatorOptions: Readonly<Record<string, unknown>>,
    attributes: Readonly<Record<string, unknown>>,
    globalOptions: Readonly<Record<string, unknown>>,
  ): string | Date;
}

export interface DateTimeOptions {
  format?: string;
  earliest?: string | Date | DateProvider;
  latest?: string | Date | DateProvider;

  notValid?: MessageFormatter<string | Date>;
  tooEarly?: MessageFormatter<string | Date>;
  tooLate?: MessageFormatter<string | Date>;
}

/**
 * default is yyyy-MM-ddTHH:mm:ss.SSSX
 * @param format see https://date-fns.org/v2.8.1/docs/format
 */
export function datetime(format?: string): Validator;
export function datetime(options?: ValidatorOptions<DateTimeOptions>): Validator;
export function datetime(options: string | ValidatorOptions<DateTimeOptions> = {}): Validator {
  const {
    message,
    notValid,
    tooEarly,
    tooLate,
    earliest,
    latest,
    format: tpl = "yyyy-MM-dd'T'HH:mm:ss.SSSX",
    ...validatorOptions
  }: ValidatorOptions<DateTimeOptions> = isString(options) ? {format: options} : options;

  if (earliest !== undefined && !isString(earliest && !isDate(earliest) && !isFunction(earliest))) {
    throw new Error(`Datetime validator expects 'earliest' must be a date string, Date or DateProvider`);
  }

  if (latest !== undefined && !isString(latest && !isDate(latest) && !isFunction(latest))) {
    throw new Error(`Datetime validator expects 'latest' must be a date string, Date or DateProvider`);
  }

  return function DateTimeValidator(value, key, attributes, globalOptions): undefined | string {
    if (!isDefined(value)) {
      return;
    }

    if (!isString(value) && !isDate(value)) {
      return error(message,"must be a date string or Date instance", {value, key, validatorOptions, attributes, globalOptions, validator: 'datetime'})
    }

    const parsed = toDate(value, tpl);
    if(datetimeFormat(parsed, tpl) !== value) {
      return error(message ?? notValid,"has invalid format (expected %{format})",
        {value, key, validatorOptions, attributes, globalOptions, validator: 'datetime', format: tpl});
    }

    if (earliest != null) {
      const expected = toDate(earliest, tpl, key, validatorOptions, attributes, globalOptions);
      if (isAfter(expected, parsed)) {
        return error(message ?? tooEarly,"is before %{earliest}",
          {value, key, validatorOptions, attributes, globalOptions, validator: 'datetime', earliest: datetimeFormat(expected, tpl)});
      }
    }

    if (latest != null) {
      const expected = toDate(latest, tpl, key, validatorOptions, attributes, globalOptions);
      if (isBefore(expected, parsed)) {
        return error(message ?? tooLate,"is after %{latest}",
          {value, key, validatorOptions, attributes, globalOptions, validator: 'datetime', latest: datetimeFormat(expected, tpl)});
      }
    }
  }
}

/**
 * default is yyyy-MM-dd
 * @param format see https://date-fns.org/v2.8.1/docs/format
 */
export function date(format?: string): Validator;
export function date(options?: ValidatorOptions<DateTimeOptions>): Validator;
export function date(options: string | ValidatorOptions<DateTimeOptions> = {}): Validator {
  return datetime(isString(options) ? {format: options} : {format: 'yyyy-MM-dd', ...options});
}

/**
 * default is HH:mm:ss.SSSX
 * @param format see https://date-fns.org/v2.8.1/docs/format
 */
export function time(format?: string): Validator;
export function time(options?: ValidatorOptions<DateTimeOptions>): Validator;
export function time(options: string | ValidatorOptions<DateTimeOptions> = {}): Validator {
  return datetime(isString(options) ? {format: options} : {format: 'HH:mm:ss.SSSX', ...options});
}
