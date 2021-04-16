import validate from '../utils';
import {MessageFormatter, Validator, ValidatorOptions} from "../interfaces";
import {LengthOptions, length} from "./length";
import {error, isArray, isDefined} from "./utils";

export interface ArrayOptions {
  length?: Omit<LengthOptions<unknown[]>, 'tokenizer'>;
  element?: Validator[];

  notValid?: string | MessageFormatter<unknown>;
  notValidLength?: string | MessageFormatter<unknown>;
  notValidElement?: string | MessageFormatter<unknown>;
}

export function array(options?: ValidatorOptions<ArrayOptions>): Validator {
  const {message, length: lengthOptions, element, notValid, notValidLength, notValidElement, ...validatorOptions}: ValidatorOptions<ArrayOptions> = options ?? {};

  return function ArrayValidator(value, key, attributes, globalOptions): undefined | string | readonly string[] {
    // Empty values are allowed. Use presence validator along with this validator for required array property.
    // Although note that presence validator considers and empty array as 'not present'.
    if (!isDefined(value)) {
      return;
    }

    // Finally validate the value
    if (!isArray(value)) {
      return error(message ?? notValid,"must be an array", {value, key, validatorOptions, attributes, globalOptions, validator: 'array'})
    }

    if (isDefined(lengthOptions)) {
      const constraints: Validator[] = [length(lengthOptions ?? {})];
      const errors = validate({".length": value}, {".length": constraints}, {format: 'flat', fullMessages: true});
      if (errors !== undefined) {
        if (message != null || notValidLength != null) {
          return error(message ?? notValidLength, "length is invalid", {value, key, validatorOptions, attributes, globalOptions, validator: 'array'})
        }

        return errors;
      }
    }

    if (isDefined(element)) {
      const constraints: Validator[] = element ?? [];
      let index = 0;
      const errors: string[] = [];
      for (const element of value) {
        const prop = `[${index}]`;
        const result = validate({[prop]: element}, {[prop]: constraints}, {format: 'flat', fullMessages: true});
        if (result !== undefined) {
          if (notValidElement != null) {
            errors.push(error(notValidElement, `element at index %{index} is not valid`, {value, key, validatorOptions, attributes, globalOptions, index, validator: 'array'}));
          } else {
            errors.push(...result);
          }
        }

        ++index;
      }

      if (errors.length) {
        if (message != null) {
          return error(message, `elements are not valid`, {value, key, validatorOptions, attributes, globalOptions, validator: 'array'})
        }
        return errors;
      }
    }
  }
}
