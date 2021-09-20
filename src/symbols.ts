type Class<T = unknown> = new (...args: unknown[]) => T;

export const ValidatorSymbol = Symbol.for('Validator');
export const ConstraintSymbol = Symbol.for('Constraint');

export function ValidatorSymbolFor(Model: Class): symbol {
  return Symbol.for(`Validator<${Model.name}>`)
}

export const Symbols = Object.freeze({
  Validator: ValidatorSymbol,
  Constraint: ConstraintSymbol,
  symbolFor: ValidatorSymbolFor,
});

export default Symbols;
