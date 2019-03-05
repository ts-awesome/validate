import {IEntityValidationMeta, IValidationOptions, IValidator, IModelValidationOptions} from "./interfaces";
import {Container} from "inversify";
import {ValidationMeta} from "./decorators";
import Symbols from './symbols';
import * as validate from 'validate.js';

interface ConstructorOf<T> {
  new (...args:any[]): T;
}

function validateFieldNames<T>(obj: T, {fields}: IEntityValidationMeta, errors: string[] = []) {
  return Object.keys(obj).map(fieldName => {
    if (!fields.has(fieldName)) {
      errors.push(`Field ${fieldName} is redundant for this model`);
      return false;
    }

    return true;
  });
}

function validateModel<T, X>(obj: T, constraint: X, errors: string[] = []): boolean {
  let validationErrors = validate(obj, constraint, { format: 'flat' });
  if (validationErrors) {
    errors.push(...validationErrors);
    return false;
  }
  return true;
}

function getArrayConstraint(presence: boolean, elementsConstraints: any): any {
  return {
    presence: presence,
    array: {
      minLength: presence ? 1 : 0,
      elementConstraints: elementsConstraints
    }
  };
}


export class ModelValidator<T> implements IValidator<T> {

  private readonly metadata: IEntityValidationMeta;

  constructor(
    Model: ConstructorOf<T>,
    private kernel: Container
  ) {
    this.metadata = (<any>Model.prototype)[ValidationMeta];
  }

  validate(value: T, options: IModelValidationOptions = {}): true | string[] {
    const errors: string[] = [];
    const fieldValidationRes = validateFieldNames<T>(value, this.metadata, errors);

    const constraints = this.getConstraint(options);
    const valueValidationRes = validateModel(value, constraints, errors);
    return <true>(fieldValidationRes && valueValidationRes) || errors;
  }

  private getConstraint({requirePrimary, requireRequired}: IModelValidationOptions): any {
    let res: any = {};

    this.metadata.fields.forEach((v, k) => {
      if (v.required && !requireRequired || v.primary && !requirePrimary) {
        return;
      }
      const presence = v.array || v.required || false;
      const notNullable = v.array || !v.allowNull || false;
      const fieldConstraints = this.getFieldConstraint(v.type!, presence, notNullable);

      res[k] = v.array
        ? getArrayConstraint(v.required || false, fieldConstraints)
        : fieldConstraints;
    });
    return res;
  }

  private getFieldConstraint(type: string, presence: boolean, not_nullable: boolean = false): any {
    try {
      const constraints = this.kernel.getAllNamed<any>(Symbols.Constraint, type);
      if (constraints.length === 1) {
        return {
          ...constraints[0],
          presence,
          not_nullable,
        }
      }
    } catch (err) {
    }
    return {
      presence,
      not_nullable,
    }
  }
}
