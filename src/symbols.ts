export const ValidatorSymbol = Symbol.for('Validator');
export const ConstraintSymbol = Symbol.for('Constraint');

export const Symbols = Object.freeze({
  Validator: ValidatorSymbol,
  Constraint: ConstraintSymbol,
});

export default Symbols;
