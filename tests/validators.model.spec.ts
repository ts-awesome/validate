import {model} from "../src/validators/model";
import {presence, type} from "../src/validators";
import {validate} from "../src";

class Model {
  @validate([presence(), type('string')])
  constructor(public test: unknown) {
  }
}

describe('validators.model', function () {

  it('allows empty values', () => {
    const validator = new Model()
    expect(model(Model)(undefined, 'key', {}, {})).not.toBeDefined();
    expect(model(Model)(null, 'key', {}, {})).not.toBeDefined();
  });
  it('check model', () => {
    expect(model(Model)({test: 'ok'}, 'key', {}, {})).not.toBeDefined();
    expect(model(Model)('   ', 'key', {}, {})).toEqual('must be an object');
  });

})
