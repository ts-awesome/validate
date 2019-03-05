export interface IModelValidationOptions {
  requirePrimary?: boolean
  requireRequired?: boolean
}

export interface ISingleValidationOptions {
  required?: boolean;
  notNullable?: boolean;
}

export type IValidationOptions = IModelValidationOptions | ISingleValidationOptions;

export interface IValidator<T> {
  validate(value: T, options?: IValidationOptions): true | string[];
}

export interface IValidationFieldMeta {
  primary?: boolean;
  required?: boolean;
  allowNull?: boolean;
  type?: string;
  array?: boolean;
}

export interface IEntityValidationMeta {
  fields: Map<string, IValidationFieldMeta>;
}
