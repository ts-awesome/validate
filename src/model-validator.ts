import {IEntityValidationMeta, IValidator, IModelValidationOptions, IContainer} from "./interfaces";
import {ValidationMetaSymbol} from "./decorators";

import {multi, prepare} from "./utils";

interface ConstructorOf<T> {
  new (...args:any[]): T;
}

export class ModelValidator<T> implements IValidator<T> {

  private readonly metadata: IEntityValidationMeta;

  constructor(
    Model: ConstructorOf<T>,
    private kernel?: IContainer
  ) {
    this.metadata = (<any>Model.prototype)[ValidationMetaSymbol];
  }

  validate(value: T, options: IModelValidationOptions = {}): true | string[] {
    const constraints = this.getConstraint();
    return multi(value, this.metadata, constraints, options);
  }

  private getConstraint(): any {
    let res: any = {};

    this.metadata.fields.forEach((meta, property) => {
      res[property] = prepare(meta, this.kernel);
    });

    return res;
  }
}
