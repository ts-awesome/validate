import {inclusion, ModelValidator, numericality, validate} from '../src';

class Model {
  @validate([numericality({greaterThan: 0})])
  public id!: number;

  @validate([inclusion(['a', 'b'])])
  public value!: string;
}

describe('model validator', () => {
  let validator = new ModelValidator(Model);

  it('should succeed', () => {
    const input = {
      id: 1,
      value: 'a',
    }

    expect(validator.validate(input)).toBeTruthy();
  });
});
