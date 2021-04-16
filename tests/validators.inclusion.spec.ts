import {inclusion} from "../src";

describe("validators.inclusion", function() {
  const within = ["foo", "bar", "baz"];

  it("allows empty values", function() {
    expect(inclusion(within)(null, 'key', {}, {})).not.toBeDefined();
    expect(inclusion(within)(undefined, 'key', {}, {})).not.toBeDefined();
  });

  it("returns nothing if the value is allowed", function() {
    expect(inclusion(within)("foo", 'key', {}, {})).not.toBeDefined();
    expect(inclusion(within)("bar", 'key', {}, {})).not.toBeDefined();
    expect(inclusion(within)("baz", 'key', {}, {})).not.toBeDefined();
  });

  it("returns an error if the value is not included", function() {
    expect(inclusion(within)("", 'key', {}, {})).toBeDefined();
    expect(inclusion(within)(" ", 'key', {}, {})).toBeDefined();
    expect(inclusion(within)("quux", 'key', {}, {})).toEqual("value (quux) is not allowed");
    expect(inclusion(within)(false, 'key', {}, {})).toEqual("value (false) is not allowed");
    expect(inclusion(within)(1, 'key', {}, {})).toEqual("value (1) is not allowed");
  });

  it("allows you to customize the message", function() {
    const opts = {within: within, message: "^%{value} is not a valid choice"};
    expect(inclusion(opts)("quux", 'key', {}, {})).toEqual("^quux is not a valid choice");
  });

  it("uses the options as the within list if the options is an array", function() {
    expect(inclusion(["foo", "bar"])("foo", 'key', {}, {})).not.toBeDefined();
    expect(inclusion(["foo", "bar"])("baz", 'key', {}, {})).toBeDefined();
  });

  it("allows functions as messages", function() {
    const message = () => "foobar";
    const options = {message, within: ["bar"]}
    expect(inclusion(options)("foo", 'key', {}, {})).toBe(message());
  });
});
