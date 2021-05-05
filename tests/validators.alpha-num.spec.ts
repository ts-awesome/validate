import {alphaNumeric} from "../src";

describe('validators.alphaNumeric', function (){
  it("allows empty values", () => {
    expect(alphaNumeric()(null, 'key', {}, {})).not.toBeDefined();
    expect(alphaNumeric()(undefined, 'key', {}, {})).not.toBeDefined();
  });

  it("allows only alphanumeric", () => {
    const e = "must be alphanumeric";
    expect(alphaNumeric()('123ASD!@#ZXCAS@!#', 'key', {}, {})).toEqual(e);
    expect(alphaNumeric()('QWErty', 'key', {}, {})).not.toBeDefined();
  });
  it("does not allows spaces", () => {
    const e = "must be alphanumeric without spaces";
    expect(alphaNumeric({allowSpaces: false})('key 123 ', 'key', {}, {})).toEqual(e);
  });

  it("does not allow types except string", () => {
    const e = "must be string";
    expect(alphaNumeric()({}, 'key', {} ,{})).toEqual(e);
    expect(alphaNumeric()([], 'key', {} ,{})).toEqual(e);
    expect(alphaNumeric()(1, 'key', {} ,{})).toEqual(e);
    expect(alphaNumeric()(true, 'key', {} ,{})).toEqual(e);

  })
})
