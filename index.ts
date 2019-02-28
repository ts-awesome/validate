import register from "./src/defaults";
import Symbols from './src/symbols';
export {IValidator, IValidationOptions} from './src/interfaces';
export {validate} from './src/decorators';
export * from './src/single-validator';
export * from './src/model-validator';
export {register}
export const Validator = Symbols.Validator;
export const Constraint = Symbols.Constraint;

