# @ts-awesome/validate

TypeScript friendly minimalistic validation library

This library inspired by [validate.js](https://github.com/ansman/validate.js). 
Kudos to ansman for great work! 

Key features:

* simplistic validator
* model validation
* reactive validation

## Bare use

```ts
import {singe, presence, email} from "@ts-awesome/validate";

const input: string;

const result = single(input, presence(), email());

if (result !== true) {
  console.log(input, 'is invalid:', ...result);
}
```

Let's check a form

```ts
import {multi, presence, email, alphaNum, password} from "@ts-awesome/validate";

const input: Record<string, unknown>;

const schema = {
  username: [presence(), alphaNum()],
  email: [presence(), email()],
  password: [presence(), password()],
}

const result = multi(input, schema);

if (result !== true) {
  console.log('input is invalid:', ...result);
}
```

For more control over validation format please check `validate` utility. 

## Use with IoC 

Single value validator

```ts
import {Container} from "inversify";
import {
  SingleValidator, 
  IValidator, 
  presence, 
  email,
  uuid,
} from "@ts-awesome/validate";

container
  .bind<IValidator<string>>(ValidatorSymbol)
  .toConstantValue(new SingleValidator(presence(), email()))
  .whenTargetNamed('email');

container
  .bind<IValidator<string>>(ValidatorSymbol)
  .toConstantValue(new SingleValidator(presence(), uuid()))
  .whenTargetNamed('uuid');
```

Model validator

```ts
import {Container} from "inversify";
import {
  ModelValidator, 
  IValidator, 
  presence, 
  email,
  password,
  alphaNum,
  validate
} from "@ts-awesome/validate";

class Model {
  @validate([presence(), alphaNum()])
  username!: string;
  
  @validate([presence(), email()])
  email!: string;
  
  @validate([presence(), password()])
  password!: string;
}

container
  .bind<IValidator<Model>>(ValidatorSymbolFor(Model))
  .toConstantValue(new ModelValidator(Model));
```

## ValidateAutomate

For reactive environments there is a need for continuous validation. 
ValidateAutomate comes to resque.

```ts
import {ValidateAutomate, validate} from "@ts-awesome/validate";

class Model {
  @validate('Username', [presence(), alphaNum()])
  username!: string;

  @validate('E-mail', [presence(), email()])
  email!: string;

  @validate('Password', [presence(), password()])
  password!: string;
}

const automate = new ValidateAutomate(Model);

automate.values.username // current entered value
automate.errors.username // current error or undefined
automate.update.username('new value'); // update value and re-validate

// partial update and validate
automate.update({
  username: 'else',
  email: 'wrong'
});

automate.attempted // true if automate.validate() was tried
automate.valid // if currently everything is valid
automate.global // any global error

automate.set(true, 'some global error'); // set global error
automate.clear(true); // clear global error

automate.set('username', 'custom error'); // set error for username
automate.clear('username'); // clear errors for username

automate.reset(); // reset all errors and attempted

const model = automate.read(); // read model if this.validate() === true
```

### Use with MobX

```ts
import { ValidateAutomate } from "@ts-awesome/validate"
import { makeAutoObservable, observable } from "mobx"

declare type Class<T> = new (...args: unknown[]) => T;

export class ObservableValidateAutomate<T> extends ValidateAutomate<T> {
  constructor(model: Class<T>, onInit?: () => void) {
    super(model, onInit)
    makeAutoObservable(this, {
      _state: observable.deep
    } as never)
  }
}
```

## Available validator factories

* `alphaNum` - checks if provide value has no special chars: !@#$%^&*(),.?":{}|<>]
* `array` - checks array, length and element constraints can be specified
* `boolean` - checks boolean values
* `datetime` - checks timestamps
* `date` - checks dates
* `time` - checks time
* `email` - checks email
* `format` - checks regex
* `length` - checks value.length, works on anything with length
* `model` - checks value to comply with model constraints
* `notNull` - check for !== null
* `numericality` - checks numbers
* `password` - checks passwords, also exports `isStrongPassword` and `getPasswordComplexity` utilities
* `presence` - checks for !== undefined
* `primary` - obsolete
* `required` - obsolete
* `type` - checks value type
* `url` - checks url
* `uuid` - checks uuid
* `exclusion` - checks against blacklist, rejects if on the list
* `inclusion` - checks against whitelist, accepts if on the list

Please note that validator factory return configured validator that can be used 
as standalone validator. Keep in mind that validator return `undefined` if valid 
or string with error. 

```ts
import {numericality} from "@ts-awesome/validate";

const validator = numericality({onlyInteger: true, greaterThan: 5, even: true});
const valid = validator(7);
```

## Custom validators 

Validator is a function that follows interface.

```ts
interface Validator<T = unknown> {
  (
    value: T, // value to examine
    key: string, // attribute name where value is stored
    attributes: Readonly<Record<string, unknown>>, // all attributes
    globalOptions: Readonly<GlobalOptions>
  ): undefined | true | string | readonly string[];
}
```
It should return `undefined` or `null` or `true` if valid.
It should return error as `string` or `readonly string[]`.

Let's create a validator that checks if password and passwordRepeat are equal

```ts
import {Validator} from "@ts-awesome/validate";
import {isDefined, error, passoword, validate} from "@ts-awesome/validate/dist/validators/utils";

function equalTo<T>(key: keyof T): Validator<unknown> {
  return function EqualToValidator(value, key, attributes) {
    if (!isDefined(value))
      return;
    
    if (value !== attributes[key]) {
      return "must be a same as " + key;
    }
  }
}

class Model {
  @validate([presence(), password()])
  password!: string;
  
  @validate('Password Repeat', [presence(), equalTo<Model>('password')])
  passwordRepeat!: string;
}
```


# License
May be freely distributed under the [MIT license](https://opensource.org/licenses/MIT).

Copyright (c) 2022 Volodymyr Iatsyshyn and other contributors

