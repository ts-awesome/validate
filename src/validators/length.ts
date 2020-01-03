import {MessageFormatter, ValidatorInstance, ValidatorOptions} from "../interfaces";

export interface LengthOptions<T extends { length: number }> {
  is?: number;
  minimum?: number;
  maximum?: number;

  tokenizer?(value?: any): T;

  notValid?: string | MessageFormatter<any>;
  tooLong?: string | MessageFormatter<any>;
  tooShort?: string | MessageFormatter<any>;
  wrongLength?: string | MessageFormatter<any>;
}

export function length<T extends { length: number }>(options: ValidatorOptions<LengthOptions<T>>): ValidatorInstance<'length'> {
  if (typeof options === 'object') {
    const {is, minimum, maximum} = options;
    if (is == null && minimum == null && maximum == null) {
      throw Error('Require on of options: is, minimum or maximum.')
    }
  }

  return {length: options}
}
