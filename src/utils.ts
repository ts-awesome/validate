import {ValidationMeta, ValidatorInstance} from "./interfaces";
import {Container} from "inversify";
import {ConstraintSymbol} from "./symbols";
import {validators} from 'validate.js';

export function prepare(constraint: ValidationMeta, kernel?: Container): ValidatorInstance<any> {
  if (typeof constraint === 'symbol') {
    constraint = kernel?.getNamed(ConstraintSymbol, this.constraint) as any;
  }

  if (Array.isArray(constraint)) {

    constraint = constraint.map(value => {
      if (typeof value !== 'function') {
        return value;
      }

      for (let name of Object.keys(validators)) {
        if (validators[name] === value) {
          return {[name]: true};
        }
      }

      const name = `__dynamic_${Date.now().toString(36)}`;
      validators[name] = value;
      return {[name]: true};
    }).reduce((acc, val) => ({
      ...acc,
      ...val
    }), {}) as any;
  }

  for(let validator of Object.keys(constraint)) {
    if (validator === 'array' && typeof constraint[validator] === 'object') {
      const [element] = constraint[validator] as any;
      if (element) {
        constraint[validator].element = prepare(element, kernel);
      }
    }
  }

  return constraint as any;
}
