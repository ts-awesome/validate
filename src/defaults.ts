import {ConstraintSymbol, ValidatorSymbol} from './symbols';
import {SingleValidator} from "./single-validator";
import {boolean, email, type, uuid, url, time, date, datetime} from "./validators";
import {IContainer} from "./interfaces";


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
  ],
  uuid: [
    type('string'),
    uuid(4),
  ],
  url: [
    type('string'),
    url(),
  ],
  time: [
    time(),
  ],
  date: [
    date(),
  ],
  datetime: [
    datetime(),
  ]
};

export default function register(kernel: IContainer) {
  Object.keys(defaults).forEach(key => {
    kernel.bind<any>(ConstraintSymbol).toConstantValue(defaults[key]).whenTargetNamed(key);
    kernel.bind<any>(ValidatorSymbol).toConstantValue(new SingleValidator(key, kernel)).whenTargetNamed(key);
  });
}
