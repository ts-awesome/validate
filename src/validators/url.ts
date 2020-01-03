import {ValidatorInstance, ValidatorOptions} from "../interfaces";

export interface UrlOptions {
  schemes?: string[] | [RegExp];
  allowLocal?: boolean;
  allowDataUrl?: boolean;
}

export function url(options?: ValidatorOptions<UrlOptions>): ValidatorInstance<'url'> {
  return {url: options ?? true};
}
