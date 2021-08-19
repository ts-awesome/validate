import {model} from "../src/validators/model";
import {presence, type} from "../src/validators";
import {validate} from "../src";

class Model {
  @validate([presence(), type('string')])
  public test!: unknown
}

describe('validators.model', function () {

  it('allows empty values', () => {
    expect(model(Model)(undefined, 'key', {}, {})).not.toBeDefined();
    expect(model(Model)(null, 'key', {}, {})).not.toBeDefined();
  });
  it('check model', () => {
    expect(model(Model)({test: 'ok'}, 'key', {}, {})).not.toBeDefined();
  });
  it('check empty model', () => {
    expect(model(Model)({}, 'key', {}, {})).toEqual('must be an object');
  });
  it('check invalid model', () => {
    expect(model(Model)({test: false}, 'key', {}, {})).toEqual('must be an object');
  });

})
