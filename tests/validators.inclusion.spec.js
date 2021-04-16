describe("validators.inclusion", function() {
  const {inclusion} = require('../dist/validators/within');
  const within = ["foo", "bar", "baz"];

  it("allows empty values", function() {
    expect(inclusion(within)(null)).not.toBeDefined();
    expect(inclusion(within)(undefined)).not.toBeDefined();
  });

  it("returns nothing if the value is allowed", function() {
    expect(inclusion(within)("foo")).not.toBeDefined();
    expect(inclusion(within)("bar")).not.toBeDefined();
    expect(inclusion(within)("baz")).not.toBeDefined();
  });

  it("returns an error if the value is not included", function() {
    expect(inclusion(within)("")).toBeDefined();
    expect(inclusion(within)(" ")).toBeDefined();
    expect(inclusion(within)("quux")).toEqual("value (quux) is not allowed");
    expect(inclusion(within)(false)).toEqual("value (false) is not allowed");
    expect(inclusion(within)(1)).toEqual("value (1) is not allowed");
  });

  it("allows you to customize the message", function() {
    const opts = {within: within, message: "^%{value} is not a valid choice"};
    expect(inclusion(opts)("quux")).toEqual("^quux is not a valid choice");
  });

  it("uses the options as the within list if the options is an array", function() {
    expect(inclusion(["foo", "bar"])("foo")).not.toBeDefined();
    expect(inclusion(["foo", "bar"])("baz")).toBeDefined();
  });

  it("allows functions as messages", function() {
    const message = () => "foobar";
    const options = {message, within: ["bar"]}
    expect(inclusion(options)("foo")).toBe(message());
  });
});
