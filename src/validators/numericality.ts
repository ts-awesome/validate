import {MessageFormatter, ValidatorInstance, ValidatorOptions} from "../interfaces";

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

  notValid?: string | MessageFormatter<any>;
  notInteger?: string | MessageFormatter<any>;
  notGreaterThan?: string | MessageFormatter<any>;
  notGreaterThanOrEqualTo?: string | MessageFormatter<any>;
  notEqualTo?: string | MessageFormatter<any>;
  notLessThan?: string | MessageFormatter<any>;
  notLessThanOrEqualTo?: string | MessageFormatter<any>;
  notDivisibleBy?: string | MessageFormatter<any>;
  notOdd?: string | MessageFormatter<any>;
  notEven?: string | MessageFormatter<any>;
}

export function numericality(options?: ValidatorOptions<NumericalityOptions>): ValidatorInstance<'numericality'> {
  return {numericality: options ?? true};
}
