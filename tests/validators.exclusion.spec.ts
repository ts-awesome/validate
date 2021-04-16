import {exclusion} from "../src";

describe("validators.exclusion", function() {
  const within = ["quux", false, 1] as never;

  it("allows empty values", function() {
    expect(exclusion(within)(null, 'key', {}, {})).not.toBeDefined();
    expect(exclusion(within)(undefined, 'key', {}, {})).not.toBeDefined();
  });

  it("returns nothing if the value is not forbidden", function() {
    expect(exclusion(within)("foo", 'key', {}, {})).not.toBeDefined();
    expect(exclusion(within)("bar", 'key', {}, {})).not.toBeDefined();
    expect(exclusion(within)("baz", 'key', {}, {})).not.toBeDefined();
  });

  it("returns an error if the value is forbidden", function() {
    expect(exclusion(within)("quux", 'key', {}, {})).toEqual("value (quux) is forbidden");
    expect(exclusion(within)(false, 'key', {}, {})).toEqual("value (false) is forbidden");
    expect(exclusion(within)(1, 'key', {}, {})).toEqual("value (1) is forbidden");
  });

  it("allows you to customize the message", function() {
    const opts = {within: within, message: "^%{value} is not a valid choice"};
    expect(exclusion(opts)("quux", 'key', {}, {})).toEqual("^quux is not a valid choice");
  });

  it("uses the options as the within list if the options is an array", function() {
    expect(exclusion(["foo", "bar"])("foo", 'key', {}, {})).toBeDefined();
    expect(exclusion(["foo", "bar"])("baz", 'key', {}, {})).not.toBeDefined();
  });

  it("allows functions as messages", function() {
    const message = () => "foobar";
    const options = {message, within: ["foo"]}
    expect(exclusion(options)("foo", 'key', {}, {})).toBe(message());
  });
});
