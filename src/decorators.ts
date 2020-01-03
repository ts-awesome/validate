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

export function validate(target: any, key: string): PropertyDecorator;
export function validate(validators: Iterable<ValidatorInstance<any> | ValidatorFunction>): Function;
export function validate(type: string): Function;
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
    if (typeof fieldMeta === 'symbol' || Array.isArray(fieldMeta)) {
      ensureMetadata(target.constructor.prototype).fields.set(key, fieldMeta);
      return ;
    }

    if (typeof fieldMeta?.type === 'symbol') {
      ensureMetadata(target.constructor.prototype).fields.set(key, fieldMeta.type);
      return ;
    }

    if (!fieldMeta || (typeof fieldMeta !== 'string' && !fieldMeta.type)) {
      const autoType = Reflect.getOwnMetadata("design:type", target, key);
      if (autoType === Object) {
        throw new Error(`Please add explicit constraints type for "${key}". Auto detect failed`);
      }

      const typeName = [Number, String, Boolean].indexOf(autoType) >= 0 ? autoType.name.toLowerCase() : autoType.name;
      fieldMeta = !fieldMeta ? typeName : {
        ...(fieldMeta as IValidationFieldMeta),
        type: typeName
      }
    }

    let fieldM: IValidationFieldMeta = typeof fieldMeta === 'string' ? { type: fieldMeta } : fieldMeta!;

    let meta: Array<ValidatorInstance<any>> | symbol = [];

    if (fieldM.type) {
      meta.push(type(fieldM.type as any));
    }

    if (fieldM.required) {
      meta.push(required({allowEmpty: !!fieldM.allowNull}));
    }

    if (fieldM.allowNull === false) {
      meta.push(notNull());
    }

    if (fieldM.primary) {
      meta.push(primary());
    }

    if (fieldM.array) {
      meta = [
        type('array'),
        array({element: [...meta]}),
      ]
    }

    ensureMetadata(target.constructor.prototype).fields.set(key, meta);
  };
}
