import _ from '@ts-awesome/model-reader';
import {single} from './utils';
import {IEntityValidationMeta} from './interfaces';
import {ValidationMetaSymbol} from './decorators';

interface UpdateFn<T> {
  (value: T): void;
}

type Updater<T> = T extends any[] ? UpdaterObj<T> & UpdateFn<T> : T extends Record<string|number, unknown> ? UpdaterObj<T> & UpdateFn<Partial<T>> : UpdateFn<T>;
type UpdaterObj<T> = { readonly [P in keyof T]: Updater<T[P]>; }
type Class<T> = new (...args: unknown[]) => T;
type Errors<T> = { [P in keyof T]?: string; }

//TODO: @observable
export class ValidateAutomate<T> {

  /**
   * is attempted
   */
  public get attempted(): boolean {
    return this._attempted;
  }

  /**
   * is current state valid
   */
  public get valid(): boolean {
    return this._global === undefined
      && Object.entries(this._errors).every(([, value]) => value === undefined)
  }

  /**
   * current values
   */
  public get values(): Partial<Readonly<T>> {
    return this._state as never;
  }

  /**
   * global error
   */
  public get global(): string | undefined {
    return this._global
  }

  /**
   * field errors
   */
  public get errors(): Partial<Readonly<Record<keyof T, string | undefined>>>  {
    return this._errors as never
  }

  private _attempted = false;
  private _state: Partial<T> = {};
  private _errors: Errors<T> = {};
  private _global: string | undefined;
  private readonly _metadata: IEntityValidationMeta;

  constructor(
    private readonly Model: Class<T>,
    onInit?: (instance: ValidateAutomate<T>) => void,
  ) {
    // super();
    // this.update = new Proxy(this.update)

    this._metadata = Model.prototype[ValidationMetaSymbol];

    this.reset();

    onInit?.(this);
  }

  /**
   * update current state with new values and validate
   */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly update: ((values: Partial<T>) => this) & UpdaterObj<T> = ((): any => {
    const result = (values: Partial<T>): this => {
      for(const [field, value] of Object.entries(values)) {
        this._state[field] = value;
        this._validate(field as never, value);
      }

      return this;
    }
    const map = new Map<string, Updater<unknown>>();
    const buildProxy = (...path: string[]): Updater<unknown> => {
      const key = path.join('--');
      if (!map.has(key)) {
        const updater = (value: unknown) => {
          let root = this._state;
          for(let i = 0; i < path.length - 1; ++i) {
            root = root[path[i]];
          }

          root[path[path.length - 1]] = value;
          this._validate(path[0] as never, this._state[path[0]]);
        };

        map.set(key, new Proxy(updater, {
          get(target: (values: unknown) => void, p: string | symbol): Updater<unknown> {
            return buildProxy(...path, p.toString());
          }
        }))
      }

      return map.get(key)!;
    }

    return buildProxy();
  })();

  /**
   * get global or field error
   */
  public get(global: true): string | undefined;
  public get(field: keyof T): string | undefined;
  public get(idx: true | keyof T): string | undefined {
    return idx === true ? this._global : this._errors[idx as never];
  }

  /**
   * force global or field error
   */
  public set(global: true, message: string): this;
  public set(field: keyof T, message: string): this;
  public set(idx: true | keyof T, message: string): this {
    if (idx === true) {
      this._global = message;
    } else {
      this._errors[idx] = message;
    }
    return this;
  }

  /**
   * clear global or field error
   */
  public clear(global: true): this;
  public clear(field: keyof T): this;
  public clear(idx: true | keyof T): this {
    if (idx === true) {
      this._global = undefined;
    } else {
      delete this._errors[idx];
    }
    return this;
  }

  /**
   * read completed model, throws if not valid, use model-reader
   */
  public read(): T {
    if (!this.valid || !this.attempted) {
      throw new Error(`Model is not valid at this point`);
    }
    return _(this._state, this.Model, true);
  }

  /**
   * reset validation state
   */
  public reset(): this {
    this._attempted = false;
    this._errors = {};
    this._global = undefined;
    return this;
  }

  /**
   * validates all and returns status
   */
  public validate(): boolean {
    this._attempted = true;
    for(const field of this._metadata.fields.keys()) {
      this._validate(field as never, this._state[field])
    }

    return this.valid;
  }

  private _validate(field: keyof T, value: unknown): void {
    const result = single(value, ...this._metadata.fields.get(field.toString()) ?? []);
    if (result !== true) {
      const [error] = result;
      this.set(field, `${this._metadata.aliases.get(field.toString()) ?? field} ${error ?? 'is invalid'}`)
    } else {
      this.clear(field);
    }
  }
}
