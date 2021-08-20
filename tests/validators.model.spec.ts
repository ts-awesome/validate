import {model} from "../src/validators/model";
import {array, presence, type} from "../src/validators";
import {validate} from "../src";

class Model {
  @validate([presence(), type('string')])
  public test!: string;

  @validate([array({element: [model(Model)]})])
  public leafs?: Model[];
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
    expect(model(Model)({}, 'key', {}, {})).toEqual(['Test can\'t be blank']);
  });
  it('check invalid model', () => {
    expect(model(Model)({test: false}, 'key', {}, {})).toEqual(['Test must be of the correct type string']);
  });
  it('check nested', () => {
    expect(model(Model)({test: 'ok', leafs: [{test:'ok'}]}, 'key', {}, {})).toEqual(undefined);
  });
  it('check nested fails', () => {
    expect(model(Model)({test: 'ok', leafs: [{test:false}]}, 'key', {}, {})).toEqual(['Leafs [0] Test must be of the correct type string']);
  });

})
