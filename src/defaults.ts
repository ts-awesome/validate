import Symbols from './symbols';
import {Container} from "inversify";
import {SingleValidator} from "./single-validator";
import * as validate from 'validate.js'

const {validators, isDefined, isBoolean, isInteger, isArray, isObject, single} = validate;

validators.not_nullable = (value: any, options: any, key: any, attributes: any) => {

  if (value === null) {
    return 'Null is not allowed';
  }
  return;
};

validators.boolean = (value: any, options: any, key: any, attributes: any) => {
  // First validate the configuration of this validator
  if (options.equalTo !== undefined && !isBoolean(options.equalTo)) {
    throw new Error(
      `boolean validator for ${key} misconfigured. \'equalTo\' must be a boolean`
    );
  }

  // Empty values are allowed. Use presence validator along with this validator for required boolean property.
  if (!isDefined(value)) {
    return;
  }

  // Finally validate the value
  if (!isBoolean(value)) {
    return "must be a boolean";
  }

  if (options.equalTo !== undefined && value !== options.equalTo) {
    return `must be ${options.equalTo}`;
  }
};

validators.array = (value: any, options: any, key: any, attributes: any) => {
  // First validate the configuration of this validator
  if (options.length !== undefined) {
    if (!isInteger(options.length)) {
      throw new Error(`array validator for ${key} misconfigured. \'length\' must be an integer`);
    }
    if (options.minLength !== undefined || options.maxLength !== undefined) {
      throw new Error(`array validator for ${key} misconfigured. cannot \'length\' and \'minLength\' or \'maxLength\'`);
    }
  }
  if (options.minLength !== undefined) {
    if (!isInteger(options.minLength)) {
      throw new Error(`array validator for ${key} misconfigured. \'minLength\' must be an integer`);
    }
  }
  if (options.maxLength !== undefined) {
    if (!isInteger(options.maxLength)) {
      throw new Error(`array validator for ${key} misconfigured. \'maxLength\' must be an integer`);
    }
    if (
      options.minLength !== undefined &&
      options.minLength > options.maxLength
    ) {
      throw new Error(`array validator for ${key} misconfigured. \'maxLength\' must be greater than or equal to \'minLength\'`);
    }
  }

  // Empty values are allowed. Use presence validator along with this validator for required array property.
  // Although note that presence validator considers and empty array as 'not present'.
  if (!isDefined(value)) {
    return;
  }

  // Finally validate the value
  if (!isArray(value)) {
    return "must be an array";
  }

  if (options.length !== undefined && value.length !== options.length) {
    return `array length must be ${options.length}`;
  }

  if (options.minLength !== undefined && value.length < options.minLength) {
    return `array length must be greater than or equal to ${options.minLength}`;
  }

  if (options.maxLength !== undefined && value.length > options.maxLength) {
    return `array length must be less than or equal to ${options.maxLength}`;
  }

  if (options.elementConstraints !== undefined) {
    for (let element of value) {
      let errors: any;
      if (isObject(element)) {
        errors = validate(element, options.elementConstraints);
      } else {
        errors = single(element, options.elementConstraints);
      }
      if (errors !== undefined) {
        return `array element invalid: ${errors.toString()}`;
      }
    }
  }
};

export const defaults = {
  string: {
  },
  number: {
    numericality: {
      noStrings: true
    }
  },
  integer: {
    numericality: {
      noStrings: true,
      onlyInteger: true
    }
  },
  boolean: {
    boolean: {}
  },
  email: {
    format: {
      pattern: /^[a-z0-9.]+(\+[a-z0-9.]+)?@([a-z0-9+]+.)+[a-z0-9]+$/
    }
  }
};

export default function register(kernel: Container) {
  Object.keys(defaults).forEach(key => {
    kernel.bind<any>(Symbols.Constraint).toConstantValue(defaults[key]).whenTargetNamed(key);
    kernel.bind<any>(Symbols.Validator).toConstantValue(new SingleValidator(kernel, key)).whenTargetNamed(key)
  });
}
