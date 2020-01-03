export type ValidatorInstance<X extends string, T = any> = Record<X, T>;

export interface ValidatorBuilder<T = any> {
  (value: T): any;
}

export interface MessageFormatter<T> {
  (value: T, attribute: any, validatorOptions: any, attributes: any, globalOptions: any): string;
}

export interface GenericOptions {
  message?: string | MessageFormatter<any>;
}

export type ValidatorOptions<T> = (T & GenericOptions) | ValidatorBuilder;

export interface ValidatorFunction<T=any> {
  (value: T, options: Record<string, any>, key: string, attributes: any, globalOptions: Record<string, any>): string | undefined;
}

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

export type ValidationMeta<T=any> = ReadonlyArray<ValidatorInstance<string> | ValidatorFunction<T>> | symbol;

export interface IEntityValidationMeta {
  fields: Map<string, ValidationMeta>;
}
