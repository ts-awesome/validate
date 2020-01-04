import {IContainer, IEntityValidationMeta, ValidationMeta, ValidatorFunction, ValidatorInstance} from "./interfaces";
import {ConstraintSymbol} from "./symbols";
import * as lib from 'validate.js';

type Bind<T=any> = ReadonlyArray<ValidatorInstance<string> | ValidatorFunction<T>> | ValidatorInstance<string>;

export function prepare(constraint: ValidationMeta, kernel?: IContainer): ValidatorInstance<any> {
  if (typeof constraint === 'symbol' || typeof constraint === 'string') {
    if (kernel == null) {
      throw Error(`Can't resolve ${String(constraint)}. Please provide kernel.`);
    }
    constraint = kernel.getNamed<Bind>(ConstraintSymbol, this.constraint);
  }

  if (Array.isArray(constraint)) {

    constraint = constraint.map(value => {
      if (typeof value !== 'function') {
        return value;
      }

      for (let name of Object.keys(lib.validators)) {
        if (lib.validators[name] === value) {
          return {[name]: true};
        }
      }

      const name = `__dynamic_${Date.now().toString(36)}`;
      lib.validators[name] = value;
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

export function single<T>(value: T, ...constraints: ReadonlyArray<ValidatorInstance<any>>): true | string[] {
  const result = lib.single(value, prepare(constraints));

  if (result !== undefined) {
    return Array.isArray(result) ? result : [result];
  }

  return true;
}

export function multi<T>(value: T, metadata: IEntityValidationMeta, rules: Record<keyof T, ValidatorInstance<any> | ReadonlyArray<ValidatorInstance<any>>>, options?: any): true | string[] {
  for(let attribute of Object.keys(rules)) {
    rules[attribute] = prepare(rules[attribute]);
  }

  const errors: string[] = [];
  const fieldValidationRes = validateFieldNames<T>(value, metadata, errors);
  const valueValidationRes = validateModel(value, rules as any, errors, options);
  return <true>(fieldValidationRes && valueValidationRes) || errors;
}

function validateFieldNames<T>(obj: T, {fields}: IEntityValidationMeta, errors: string[] = []) {
  return Object.keys(obj).map(fieldName => {
    if (!fields.has(fieldName)) {
      errors.push(`Field ${fieldName} is not expected by model`);
      return false;
    }

    return true;
  }).every(x => x);
}

function validateModel<T>(obj: T, constraint: ValidatorInstance<any>, errors: string[], options?: object): boolean {
  let validationErrors = lib(obj, constraint, { format: 'flat', ...options });
  if (validationErrors) {
    errors.push(...validationErrors);
    return false;
  }
  return true;
}
