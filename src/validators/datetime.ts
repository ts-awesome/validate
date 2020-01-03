import {ValidatorInstance, ValidatorOptions} from "../interfaces";

export interface DatetimeOptions<T = Date | string> {
  earliest?: T;
  latest?: T;
  dateOnly?: boolean;
}

export function date<T = Date | string>(options?: ValidatorOptions<Omit<DatetimeOptions<T>, 'dateOnly'>>): ValidatorInstance<'datetime'> {
  return datetime(options);
}

export function datetime<T = Date | string>(options?: ValidatorOptions<DatetimeOptions<T>>): ValidatorInstance<'datetime'> {
  return {datetime: options ?? true};
}
