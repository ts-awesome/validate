import {type} from "../src";

describe('validators.type', function() {

  it("allows empty values", function() {
    expect(type()(null, 'key', {}, {})).not.toBeDefined();
    expect(type()(undefined, 'key', {}, {})).not.toBeDefined();
  });

  it("allows the correct type", function() {
    expect(type({type: "string"})("", 'key', {}, {})).not.toBeDefined();
    expect(type({type: "object"})({}, 'key', {}, {})).not.toBeDefined();
    expect(type({type: "array"})([], 'key', {}, {})).not.toBeDefined();
    expect(type({type: "number"})(1, 'key', {}, {})).not.toBeDefined();
    expect(type({type: "number"})(1.1, 'key', {}, {})).not.toBeDefined();
    expect(type({type: "integer"})(1, 'key', {}, {})).not.toBeDefined();
    expect(type({type: "boolean"})(true, 'key', {}, {})).not.toBeDefined();
  });

  it("doesn't allow the incorrect type", function() {
    expect(type({type: "object"})("", 'key', {}, {})).toBeDefined();
    expect(type({type: "object"})([], 'key', {}, {})).toBeDefined();
    expect(type( {type: "array"})({},'key', {}, {})).toBeDefined();
    expect(type({type: "number"})([], 'key', {}, {})).toBeDefined();
    expect(type({type: "integer"})(1.1, 'key', {}, {})).toBeDefined();
    expect(type({type: "boolean"})(1, 'key', {}, {})).toBeDefined();
    expect(type( {type: "date"})(true,'key', {}, {})).toBeDefined();
  });
});
