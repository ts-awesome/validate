import {alphaNumeric} from "../src";

describe('validators.alphaNumeric', function (){
  it("allows empty values", () => {
    expect(alphaNumeric()(null, 'key', {}, {})).not.toBeDefined();
    expect(alphaNumeric()(undefined, 'key', {}, {})).not.toBeDefined();
  });

  it("allows only alphanumeric", () => {
    const e = "must be alphanumeric";
    expect(alphaNumeric()('123ASD !@#ZXCAS@!#', 'key', {}, {})).toEqual(e);
    expect(alphaNumeric()('123qwe', 'key', {}, {})).toBeDefined();
  })
  it("allows spaces", () => {
    expect(alphaNumeric({allowSpaces: true})('123 QWE', 'key', {}, {}));
  })
})
