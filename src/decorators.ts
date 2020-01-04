import "reflect-metadata";
import {
  IEntityValidationMeta,
  IValidationFieldMeta,
  ValidationMeta,
  ValidatorFunction,
  ValidatorInstance
} from "./interfaces";
import {array, notNull, primary, required, type} from "./validators";

export const ValidationMetaSymbol = Symbol.for('ValidationMetaSymbol');

function ensureMetadata(proto: any): IEntityValidationMeta {
  if (!proto[ValidationMetaSymbol]) {
    proto[ValidationMetaSymbol] = {
      fields: new Map<string, ValidationMeta>()
    }
  }

  return proto[ValidationMetaSymbol];
}

export function validate(target: any, key: string): void;
export function validate(validators: Iterable<ValidatorInstance<any> | ValidatorFunction>): Function;
export function validate(kind: string): Function;
export function validate(constraint: symbol): Function;
export function validate(meta: IValidationFieldMeta): Function;
export function validate(): Function;
export function validate(): any {
  const args = [].slice.call(arguments);

  if (args.length > 1 && typeof args[1] === 'string') {
    // @ts-ignore
    return validator(...args);
  }

  let [fieldMeta] = args;
  return function validator (target: any, key: string) {
    if (typeof fieldMeta === 'symbol' || typeof fieldMeta === 'string' || Array.isArray(fieldMeta)) {
      ensureMetadata(target.constructor.prototype).fields.set(key, fieldMeta);
      return ;
    }

    if (fieldMeta?.type !== undefined) {
      ensureMetadata(target.constructor.prototype).fields.set(key, fieldMeta.type);
      return ;
    }

    let meta: Array<ValidatorInstance<any>> | symbol = [];
    if (!fieldMeta) {
      const autoType = Reflect.getOwnMetadata("design:type", target, key);
      if (autoType === Object) {
        throw new Error(`Please add explicit constraints for "${key}". Auto detect failed`);
      }

      if ([Number, String, Boolean].indexOf(autoType)) {
        meta.push(type(autoType.name.toLowerCase()));
        return
      }

      ensureMetadata(target.constructor.prototype).fields.set(key, autoType.name);
      return ;
    }

    let fieldM: IValidationFieldMeta = fieldMeta!;

    if (fieldM.array) {
      meta = [
        type('array'),
        array({
          element: fieldM.type,
          length: fieldM.required ? {minimum: 1} : undefined,
        }),
      ]
    } else if (fieldM.type) {
      meta.push(type(fieldM.type as any));
    }

    if (fieldM.required) {
      meta.push(required());
    }

    if (fieldM.allowNull === false) {
      meta.push(notNull());
    }

    if (fieldM.primary) {
      meta.push(primary());
    }

    ensureMetadata(target.constructor.prototype).fields.set(key, meta);
  };
}
