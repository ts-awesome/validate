export interface MessageFormatter<T> {
  (
    value: T,
    attribute: string,
    validatorOptions: Readonly<Record<string, unknown>>,
    attributes: Readonly<Record<string, unknown>>,
    globalOptions: Readonly<Record<string, unknown>>,
    extra?: Readonly<Record<string, unknown>>,
  ): string;
}

export interface GenericOptions {
  message?: string | MessageFormatter<unknown>;
  [key: string]: unknown;
}

export type ValidatorOptions<T> = T & GenericOptions;

export interface IModelValidationOptions {
  requirePrimary?: boolean;
  requireRequired?: boolean;
  restrictExtraFields?: boolean;
}

export interface ISingleValidationOptions {
  required?: boolean;
  notNullable?: boolean;
}

export type IValidationOptions = IModelValidationOptions | ISingleValidationOptions;

export interface IValidator<T> {
  validate(value: T, options?: IValidationOptions): true | readonly string[];
}

export interface IValidationFieldMeta {
  primary?: boolean;
  required?: boolean;
  allowNull?: boolean;
  type?: string | ConstructorOf;
  array?: boolean;
  name?: string;
}

export interface IEntityValidationMeta<T extends Record<string, unknown> = Record<string, unknown>> {
  aliases: Map<keyof T, string>;
  fields: Map<keyof T, readonly Validator[]>;
}

export interface Validator<T = unknown> {
  (
    value: T,
    key: string,
    attributes: Readonly<Record<string, unknown>>,
    globalOptions: Readonly<GlobalOptions>
  ): undefined | true | string | readonly string[];
}

export interface ErrorInfo<T = unknown> {
  value: T;
  error: string;
  attribute: string;
  validator: string;
}

export interface GlobalOptions {
  format?: 'flat' | 'raw' | 'grouped';
  fullMessages?: boolean;
  humanize?: boolean;
  prettify?: (obj: unknown) => string;

  [key: string]: unknown;
}

export interface ConstructorOf<T extends Record<string, unknown> = Record<string, unknown>> {
  new(...args: unknown[]): T;
}
