import {format} from "../src";

describe("validators.format", function() {
  const options1 = {pattern: /^foobar$/i}
  const options2 = {pattern: "^foobar$", flags: "i"};

  it("allows undefined values", () => {
    expect(format(options1)(null, 'key', {},{})).not.toBeDefined();
    expect(format(options2)(null, 'key', {},{})).not.toBeDefined();
    expect(format(options1)(undefined, 'key', {}, {})).not.toBeDefined();
    expect(format(options2)(undefined, 'key', {}, {})).not.toBeDefined();
  });

  it("allows values that matches the pattern", () => {
    expect(format(options1)("fooBAR", 'key', {}, {})).not.toBeDefined();
    expect(format(options2)("fooBAR", 'key', {}, {})).not.toBeDefined();
  });

  it("doesn't allow values that doesn't matches the pattern", () => {
    expect(format(options1)("", 'key', {}, {})).toBeDefined("is invalid");
    expect(format(options2)("", 'key', {}, {})).toBeDefined("is invalid");
    expect(format(options1)(" ", 'key', {}, {})).toBeDefined("is invalid");
    expect(format(options2)(" ", 'key', {}, {})).toBeDefined("is invalid");
    expect(format(options1)("barfoo", 'key', {}, {})).toEqual("is invalid");
    expect(format(options2)("barfoo", 'key', {}, {})).toEqual("is invalid");
  });

  it("non strings are not allowed", () => {
    const obj = {toString: () => { return "foobar"; }};
    expect(format(options1)(obj, 'key', {}, {})).toBeDefined();
    expect(format(options2)(obj, 'key', {}, {})).toBeDefined();
    expect(format(options1)(3, 'key', {}, {})).toBeDefined();
    expect(format(options2)(3, 'key', {}, {})).toBeDefined();
  });

  it("non strings are not allowed", () => {
    expect(format(options1)(3, 'key', {}, {})).toBeDefined();
    expect(format(options2)(3, 'key', {}, {})).toBeDefined();
  });

  it("doesn't allow partial matches",() => {
    const  options1 = {pattern: /\.png$/g}
    const options2 = {pattern: "\\.png$", flags: "g"};
    expect(format(options1)("foo.png", '', {}, {})).toBeDefined();
    expect(format(options2)("foo.png", '', {}, {})).toBeDefined();
  });

  it("supports the options being the pattern", () => {
    expect(format(options1.pattern)("barfoo", 'key', {}, {})).toBeDefined();
    expect(format(options2.pattern)("barfoo", 'key', {}, {})).toBeDefined();
  });
});
