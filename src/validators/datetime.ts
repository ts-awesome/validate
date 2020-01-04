import {isDefined, validators, format as template} from 'validate.js';
import {format, isAfter, isBefore, parse} from 'date-fns';
import {MessageFormatter, ValidatorFunction, ValidatorInstance, ValidatorOptions} from "../interfaces";

function toDate(date: string | Date, tpl: string): Date {
  if (date instanceof Date) {
    date = format(date, tpl);
  }
  return parse(date, tpl, new Date);
}

validators.datetime = ((value, options) => {
  if (!isDefined(value)) {
    return;
  }

  const tpl = options.format ?? 'yyyy-MM-ddTHH:mm:ss.SSSX';

  const parsed = toDate(value, tpl);
  if(format(parsed, tpl) !== value) {
    return template(
      options.message ?? options.notValid ?? `has invalid format, expected %{format}`,
      {format: tpl, value});
  }

  if (options.earliest) {
    const earliest = toDate(options.earliest, tpl);
    if (isAfter(earliest, parsed)) {
      return template(
        options.message ?? options.tooEarly ?? `is before %{earliest}`,
        {earliest: format(earliest, tpl), value});
    }
  }

  if (options.latest) {
    const latest = toDate(options.latest, tpl);
    if (isBefore(latest, parsed)) {
      return template(
        options.message ?? options.tooLate ?? `is after %{latest}`,
        {latest: format(latest, tpl), value});
    }
  }
}) as ValidatorFunction;

export interface DateTimeOptions {
  format?: string;
  earliest?: Date | (() => Date);
  latest?: Date | (() => Date);

  notValid?: MessageFormatter<any>;
  tooEarly?: MessageFormatter<any>;
  tooLate?: MessageFormatter<any>;
}

/**
 * default is yyyy-MM-ddTHH:mm:ss.SSSX
 * @param format see https://date-fns.org/v2.8.1/docs/format
 */
export function datetime(format?: string): ValidatorInstance<'datetime'>;
export function datetime(options?: ValidatorOptions<DateTimeOptions>): ValidatorInstance<'datetime'>;
export function datetime(options?: string | ValidatorOptions<DateTimeOptions>): ValidatorInstance<'datetime'> {
  return {datetime: typeof options === 'string' ? {format: options} : (options ?? true)};
}

/**
 * default is yyyy-MM-dd
 * @param format see https://date-fns.org/v2.8.1/docs/format
 */
export function date(format?: string): ValidatorInstance<'datetime'>;
export function date(options?: ValidatorOptions<DateTimeOptions>): ValidatorInstance<'datetime'>;
export function date(options?: string | ValidatorOptions<DateTimeOptions>): ValidatorInstance<'datetime'> {
  return {datetime: typeof options === 'string' ? {format: options} : {format: 'yyyy-MM-dd', ...options}};
}

/**
 * default is HH:mm:ss.SSSX
 * @param format see https://date-fns.org/v2.8.1/docs/format
 */
export function time(format?: string): ValidatorInstance<'datetime'>;
export function time(options?: ValidatorOptions<DateTimeOptions>): ValidatorInstance<'datetime'>;
export function time(options?: string | ValidatorOptions<DateTimeOptions>): ValidatorInstance<'datetime'> {
  return {datetime: typeof options === 'string' ? {format: options} : {format: 'HH:mm:ss.SSSX', ...options}};
}
