import {presence} from "../src";

describe('validator.presence', function() {
  
  it("doesn't allow undefined values", function() {
    expect(presence()(null, 'key',{}, {})).toBeDefined();
    expect(presence()(undefined, 'key', {}, {})).toBeDefined();
  });

  it("allows non empty values", function() {
    expect(presence()('foo', 'key', {}, {})).not.toBeDefined();
    expect(presence()(0, 'key', {}, {})).not.toBeDefined();
    expect(presence()(false, 'key', {}, {})).not.toBeDefined();
    expect(presence()([null], 'key', {}, {})).not.toBeDefined();
    expect(presence()({foo: null}, 'key', {}, {})).not.toBeDefined();
    expect(presence()(function(){return null;}, 'key', {}, {})).not.toBeDefined();
    expect(presence()('', 'key', {}, {})).not.toBeDefined();
    expect(presence()('  ', 'key', {}, {})).not.toBeDefined();
    expect(presence()([], 'key', {}, {})).not.toBeDefined();
    expect(presence()({}, 'key', {}, {})).not.toBeDefined();
  });

  it("has an option for not allowing empty values", function() {
    expect(presence({allowEmpty: false})('', 'key', {}, {})).toBeDefined();
    expect(presence({allowEmpty: false})('  ', 'key', {}, {})).toBeDefined();
    expect(presence({allowEmpty: false})([], 'key', {}, {})).toBeDefined();
    expect(presence({allowEmpty: false})({}, 'key', {}, {})).toBeDefined();
  });

  it("allows functions as messages", function() {
    const message = function() { return "foo"; };
    const options = {message: message}
    const value = null;
    expect(presence(options)(value, 'key', {}, {})).toBe(message());
  });
});
