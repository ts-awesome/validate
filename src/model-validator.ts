import {IEntityValidationMeta, IValidator, IModelValidationOptions} from "./interfaces";
import {Container} from "inversify";
import {ValidationMetaSymbol} from "./decorators";
import * as validate from 'validate.js';
import {prepare} from "./utils";

interface ConstructorOf<T> {
  new (...args:any[]): T;
}

export class ModelValidator<T> implements IValidator<T> {

  private readonly metadata: IEntityValidationMeta;

  constructor(
    Model: ConstructorOf<T>,
    private kernel: Container
  ) {
    this.metadata = (<any>Model.prototype)[ValidationMetaSymbol];
  }

  validate(value: T, options: IModelValidationOptions = {}): true | string[] {
    const errors: string[] = [];
    const fieldValidationRes = validateFieldNames<T>(value, this.metadata, errors);

    const constraints = this.getConstraint();
    const valueValidationRes = validateModel(value, constraints, errors, options);
    return <true>(fieldValidationRes && valueValidationRes) || errors;
  }

  private getConstraint(): any {
    let res: any = {};

    this.metadata.fields.forEach((meta, property) => {
      res[property] = prepare(meta, this.kernel);
    });

    return res;
  }
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

function validateModel(obj: any, constraint: any, errors: string[], options?: object): boolean {
  let validationErrors = validate(obj, constraint, { format: 'flat', ...options });
  if (validationErrors) {
    errors.push(...validationErrors);
    return false;
  }
  return true;
}
