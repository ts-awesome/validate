import {
  ErrorInfo, GlobalOptions,
  IEntityValidationMeta,
  IModelValidationOptions, Validator,
} from "./interfaces";
import {capitalize, tpl, isEmpty, prettify} from "./validators/utils";

function nameOf(x: Validator): string {
  return x.name || 'anonymous';
}

function flattenErrors(errors: readonly ErrorInfo[]): readonly string[] {
  const values = errors
    .map(({error: _}) => _)
    .filter(_ => _ != null) as string[];

  return [...new Set(values).values()]; // unique
}

function groupErrorsBy(errors: readonly ErrorInfo[], key: 'attribute' | 'validator'): Record<string, ErrorInfo[]> {
  const result = {};
  for (const error of errors) {
    const _ = error[key];
    if (!result[_]) {
      result[_] = [];
    }

    result[_].push(error);
  }

  return result;
}

const formatters = {
  raw(x: readonly ErrorInfo[]): readonly ErrorInfo[] { return x },

  flat(x: readonly ErrorInfo[]): readonly string[] { return flattenErrors(x) },

  grouped(x: readonly ErrorInfo[]): Readonly<Record<string, readonly string[]>> {
    return Object.fromEntries(Object
      .entries(groupErrorsBy(x, 'attribute'))
      .map(([key, group]) => [key, flattenErrors(group)])
    );
  }
};

export function run<T extends Record<string, unknown>>(
  attributes: T,
  constraints: Record<keyof T, readonly Validator[]>,
  globalOptions: GlobalOptions
): ErrorInfo[] {
  const results: ErrorInfo[] = [];

  for (const [attribute, validators] of Object.entries(constraints)) {
    const value = attributes[attribute];

    for (const validator of validators) {
      const result = validator(value, attribute, attributes, globalOptions);

      const errors = result == null || result === true ? [] : Array.isArray(result) ? result : [result];
      for (const error of errors) {
        results.push({
          value,
          attribute,
          validator: nameOf(validator),
          error,
        });
      }
    }
  }

  return results;
}

function process(
  errors: ErrorInfo[],
  options: GlobalOptions = {}
): undefined | readonly string[] | Readonly<Record<string, readonly string[]>> | readonly ErrorInfo[] {

  if (isEmpty(errors)) {
    return undefined;
  }

  const S = options.prettify ?? prettify;
  for (const errorInfo of errors) {
    const {value, attribute} = errorInfo;
    let {error} = errorInfo;

    // if message starts with ^, means it's final, no need to prepend with field name
    if (error.startsWith('^')) {
      error = error.slice(1);
    } else if (options.fullMessages !== false) {
      error = capitalize(S(attribute)) + " " + error;
    }

    error = error.replace(/\\\^/g, "^");
    errorInfo.error = tpl(error, { value: S(value) });
  }

  const formatting: keyof typeof formatters = options.format ?? "grouped";
  if (typeof formatters[formatting] !== 'function') {
    throw new Error(`Unknown formatting ${formatting}`);
  }

  const result = formatters[formatting](errors);
  return isEmpty(result) ? undefined : result;
}

function validate<T extends Record<string, unknown>>(attributes: T, constraints: Record<keyof T, readonly Validator[]>, globalOptions: Omit<GlobalOptions, 'format'> & {format: 'raw'}): undefined | readonly ErrorInfo[];
function validate<T extends Record<string, unknown>>(attributes: T, constraints: Record<keyof T, readonly Validator[]>, globalOptions: Omit<GlobalOptions, 'format'> & {format: 'flat'}): undefined | readonly string[];
function validate<T extends Record<string, unknown>>(attributes: T, constraints: Record<keyof T, readonly Validator[]>, globalOptions?: Omit<GlobalOptions, 'format'> & {format?: undefined | 'grouped'}): undefined | Readonly<Record<string, readonly string[]>>;
function validate<T extends Record<string, unknown>>(attributes: T, constraints: Record<keyof T, readonly Validator[]>, globalOptions: GlobalOptions = {}): undefined | readonly ErrorInfo[] | readonly string[] | Readonly<Record<string, readonly string[]>> {
  const results = run(attributes, constraints, globalOptions);
  return process(results, globalOptions);
}

export {validate};
export default validate;

export function single<T>(value: T, ...constraints: readonly Validator[]): true | readonly string[] {
  const result = validate({value}, {value: constraints}, {
    format: 'flat',
    fullMessages: false,
  });

  return result !== undefined ? result : true;
}

export function multi<T extends Record<string, unknown>>(
  value: T,
  metadata: IEntityValidationMeta,
  constraints: Record<keyof T, readonly Validator[]>,
  {restrictExtraFields = true, ... options}: IModelValidationOptions = {}
): true | readonly string[] {

  const errors: string[] = [
    ...(validate(value, constraints, { ...options, format: 'flat', fullMessages: true }) ?? [])
  ];

  if (restrictExtraFields) {
    for (const fieldName of Object.keys(value)) {
      if (!Object.prototype.hasOwnProperty.call(constraints, fieldName)) {
        errors.push(`${fieldName} is not expected`);
      }
    }
  }

  return errors.length === 0 ? true : errors;
}
