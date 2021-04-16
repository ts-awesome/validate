import "reflect-metadata";
import {
  IEntityValidationMeta,
  IValidationFieldMeta,
  Validator,
} from "./interfaces";
import {array, notNull, primary, required, type} from "./validators";
import {isFunction, isString} from "./validators/utils";
import {model} from "./validators/model";

/* eslint-disable @typescript-eslint/ban-types */

export const ValidationMetaSymbol = Symbol.for('ValidationMetaSymbol');

function ensureMetadata(proto: Object): IEntityValidationMeta {
  if (!proto[ValidationMetaSymbol]) {
    proto[ValidationMetaSymbol] = {
      aliases: new Map<string, string>(),
      fields: new Map<string, Validator[]>()
    }
  }

  return proto[ValidationMetaSymbol];
}

export function validate(target: Object, key: string | symbol): void;
export function validate(name: string, validators: Iterable<Validator>): PropertyDecorator;
export function validate(validators: Iterable<Validator>): PropertyDecorator;
/** @deprecated */
export function validate(meta: IValidationFieldMeta): PropertyDecorator;
export function validate(): PropertyDecorator;
export function validate(...args: unknown[]): void | PropertyDecorator {
  if (args.length > 1 && (typeof args[1] === 'string' || typeof args[1] === 'symbol')) {
    return validator(...args as [Object, string | symbol]);
  }

  const alias = typeof args[0] === 'string' ? args.shift() : null;
  const [fieldMeta] = args;
  return validator;

  function validator (target: Object, key: string | symbol): void {
    if (typeof fieldMeta === 'symbol' || typeof fieldMeta === 'string'){
      throw new Error(`No supported`);
    }

    if (typeof alias === 'string') {
      ensureMetadata(target.constructor.prototype).aliases.set(key.toString(), alias);
    }

    if (Array.isArray(fieldMeta)) {
      ensureMetadata(target.constructor.prototype).fields.set(key.toString(), fieldMeta);
      return ;
    }

    if (fieldMeta == null) {
      const meta: Validator[] = [];
      const autoType = Reflect.getOwnMetadata("design:type", target, key);
      if (autoType === Object) {
        throw new Error(`Please add explicit constraints for "${key.toString()}". Auto detect failed`);
      }

      if ([Number, String, Boolean].indexOf(autoType)) {
        meta.push(type(autoType.name.toLowerCase()));
      }

      ensureMetadata(target.constructor.prototype).fields.set(key.toString(), meta);
      return;
    }

    const desc: IValidationFieldMeta = fieldMeta as never;

    const meta: Validator[] = [];
    if (desc.required) {
      meta.push(required());
    }

    if (desc.allowNull === false) {
      meta.push(notNull());
    }

    if (desc.primary) {
      meta.push(primary());
    }

    if (desc.array) {
      meta.push(
        type('array'),
        array({
          element: isString(desc.type) ? [type(desc.type as never)] : isFunction(desc.type) ? [model(desc.type)] : undefined,
          length: desc.required ? {minimum: 1} : undefined,
        }),
      );
    } else if (desc.type) {
      meta.push(type(desc.type as never));
    }

    ensureMetadata(target.constructor.prototype).fields.set(key.toString(), meta);
  }
}
