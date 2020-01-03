import Symbols from './symbols';
import {Container} from "inversify";
import {SingleValidator} from "./single-validator";
import {boolean, email, type} from "./validators";


export const defaults = {
  string: [
    type('string'),
  ],
  number: [
    type('number'),
  ],
  integer: [
    type('integer'),
  ],
  boolean: [
    type('boolean'),
    boolean(),
  ],
  email: [
    type('string'),
    email(),
  ]
};

export default function register(kernel: Container) {
  Object.keys(defaults).forEach(key => {
    kernel.bind<any>(Symbols.Constraint).toConstantValue(defaults[key]).whenTargetNamed(key);
    kernel.bind<any>(Symbols.Validator).toConstantValue(new SingleValidator(kernel, defaults[key])).whenTargetNamed(key)
  });
}
