import {MessageFormatter, Validator, ValidatorOptions} from "../interfaces";
import {error, isDefined, isNumber} from "./utils";

export interface LengthOptions<T extends { length: number }> {
  is?: number;
  minimum?: number;
  maximum?: number;

  tokenizer?(value?: unknown): T;

  notValid?: string | MessageFormatter<unknown>;
  tooLong?: string | MessageFormatter<unknown>;
  tooShort?: string | MessageFormatter<unknown>;
  wrongLength?: string | MessageFormatter<unknown>;
}

export function length<T extends { length: number } = unknown[]>(options: ValidatorOptions<LengthOptions<T>>): Validator {
  const {is, minimum, maximum} = options ?? {};

  if (is == null && minimum == null && maximum == null) {
    throw Error('Requires one of options: is, minimum or maximum.')
  }

  const {
    message,
    wrongLength,
    tooShort,
    tooLong,
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    tokenizer = ((_: unknown) => _ as unknown[]),
    ...validatorOptions
  } = options ?? {};

  return function LengthValidator(value, key, attributes, globalOptions): undefined | string | readonly string[]{
    // Empty values are allowed
    if (!isDefined(value)) {
      return;
    }

    const errors = [];

    const length = tokenizer(value)?.length;
    if(!isNumber(length)) {
      return error(message, "has an incorrect length", {value, key, validatorOptions, attributes, globalOptions, validator: LengthValidator.name});
    }

    // Is checks
    if (isNumber(is) && length !== is) {
      errors.push(error(wrongLength, "is the wrong length (should be %{count} characters)", {value, key, validatorOptions, attributes, globalOptions, validator: LengthValidator.name, count: is}));
    }

    if (isNumber(minimum) && length < minimum) {
      errors.push(error(tooShort, "is too short (minimum is %{count} characters)",{value, key, validatorOptions, attributes, globalOptions, validator: LengthValidator.name, count: minimum}));
    }

    if (isNumber(maximum) && length > maximum) {
      errors.push(error(tooLong, "is too long (maximum is %{count} characters)",{value, key, validatorOptions, attributes, globalOptions, validator: LengthValidator.name, count: maximum}));
    }

    if (errors.length > 0) {
      if (message != null) {
        return error(message, "", {value, key, validatorOptions, attributes, globalOptions, validator: LengthValidator.name});
      }

      return errors;
    }
  }
}
