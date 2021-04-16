import {MessageFormatter, Validator, ValidatorOptions} from "../interfaces";
import {
  capitalize, error,
  isDefined,
  isEmpty,
  isInteger,
  isNumber,
  isString,
  prettify as globalPrettify
} from "./utils";


export interface NumericalityOptions {
  /** Per default strings are coerced to numbers using the + operator. */
  noStrings?: boolean;
  /** Real numbers won't be allowed. The error message is must be an integer */
  onlyInteger?: boolean;
  /** Enables more strict validation of strings. Leading zeroes won't be allowed and the number cannot be malformed. */
  strict?: boolean;

  greaterThan?: number;
  greaterThanOrEqualTo?: number;
  equalTo?: number;
  lessThanOrEqualTo?: number;
  lessThan?: number;
  divisibleBy?: number;

  odd?: boolean;
  even?: boolean;

  notValid?: string | MessageFormatter<unknown>;
  notInteger?: string | MessageFormatter<unknown>;
  notGreaterThan?: string | MessageFormatter<unknown>;
  notGreaterThanOrEqualTo?: string | MessageFormatter<unknown>;
  notEqualTo?: string | MessageFormatter<unknown>;
  notLessThan?: string | MessageFormatter<unknown>;
  notLessThanOrEqualTo?: string | MessageFormatter<unknown>;
  notDivisibleBy?: string | MessageFormatter<unknown>;
  notOdd?: string | MessageFormatter<unknown>;
  notEven?: string | MessageFormatter<unknown>;
}

const checks: Record<string, (v: number, c: number) => boolean> = {
  greaterThan:          function(v, c) { return v > c; },
  greaterThanOrEqualTo: function(v, c) { return v >= c; },
  equalTo:              function(v, c) { return v === c; },
  lessThan:             function(v, c) { return v < c; },
  lessThanOrEqualTo:    function(v, c) { return v <= c; },
  divisibleBy:          function(v, c) { return v % c === 0; }
}

export function numericality(options: ValidatorOptions<NumericalityOptions> = {}): Validator {
  const {
    message,
    notValid,
    notInteger,
    notOdd,
    notEven,

    strict,
    onlyInteger,
    noStrings,

    odd,
    even,

    ...validatorOptions
  } = options;

  return function NumericalityValidator(value, key, attributes, globalOptions): undefined | string | readonly string[]{
    // Empty values are fine
    if (!isDefined(value)) {
      return;
    }

    // Strict will check that it is a valid looking number
    if (isString(value) && strict) {
      let pattern = "^-?(0|[1-9]\\d*)";
      if (!onlyInteger) {
        pattern += "(\\.\\d+)?";
      }
      pattern += "$";

      if (!(new RegExp(pattern).test(value))) {
        return error(message ?? notValid, "must be a valid number", {value, key, validatorOptions, attributes, globalOptions, validator: 'numericality'});
      }
    }

    // Coerce the value to a number unless we're being strict.
    if (noStrings !== true && isString(value) && !isEmpty(value)) {
      value = +value;
    }

    // If it's not a number we shouldn't continue since it will compare it.
    if (!isNumber(value)) {
      return error(message ?? notValid, "is not a number", {value, key, validatorOptions, attributes, globalOptions, validator: 'numericality'});
    }

    // Same logic as above, sort of. Don't bother with comparisons if this
    // doesn't pass.
    if (onlyInteger && !isInteger(value)) {
      return error(message ?? notInteger, "must be an integer", {value, key, validatorOptions, attributes, globalOptions, validator: 'numericality'});
    }

    const errors = [];
    const prettify = globalOptions?.prettify ?? globalPrettify;

    for (const [name, check] of Object.entries(checks)) {
      const count = validatorOptions[name];
      if (isNumber(count) && !check(value, count)) {
        // This picks the default message if specified
        // For example the greaterThan check uses the message from
        // this.notGreaterThan so we capitalize the name and prepend "not"
        const key: 'notGreaterThan' = "not" + capitalize(name) as never;

        errors.push(error(validatorOptions[key], "must be %{type} %{count}", {
          value, key, validatorOptions, attributes, globalOptions, validator: 'numericality',
          count: count,
          type: prettify(name)
        }));
      }
    }

    if (odd && value % 2 !== 1) {
      errors.push(error(notOdd, "must be odd", {value, key, validatorOptions, attributes, globalOptions, validator: 'numericality'}));
    }

    if (even && value % 2 !== 0) {
      errors.push(error(notEven, "must be even", {value, key, validatorOptions, attributes, globalOptions, validator: 'numericality'}));
    }

    if (errors.length) {
      if (message) {
        return error(message, "is not a valid", {value, key, validatorOptions, attributes, globalOptions, validator: 'numericality'});
      }
      return errors;
    }
  }
}
