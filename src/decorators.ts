import {IEntityValidationMeta, IValidationFieldMeta} from "./interfaces";
import "reflect-metadata";

export const ValidationMeta = Symbol();

function ensureMetadata(proto: any): IEntityValidationMeta {
  if (!proto[ValidationMeta]) {
    proto[ValidationMeta] = {
      fields: new Map<string, IValidationFieldMeta>()
    }
  }

  return proto[ValidationMeta];
}

export function validate(fieldMeta?: IValidationFieldMeta | string): Function {
  return function (target: any, key: string) {
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

    if (fieldM.required === undefined) {
      fieldM.required = false; // BY default required always false;
    }

    if (fieldM.allowNull === undefined) {
      fieldM.allowNull = !fieldM.required;
    }

    ensureMetadata(target.constructor.prototype).fields.set(key, fieldM);
  };
}
