describe("validators.exclusion", function() {
  const {exclusion} = require('../dist/validators/within');
  const within = ["quux", false, 1];

  it("allows empty values", function() {
    expect(exclusion(within)(null)).not.toBeDefined();
    expect(exclusion(within)(undefined)).not.toBeDefined();
  });

  it("returns nothing if the value is not forbidden", function() {
    expect(exclusion(within)("foo")).not.toBeDefined();
    expect(exclusion(within)("bar")).not.toBeDefined();
    expect(exclusion(within)("baz")).not.toBeDefined();
  });

  it("returns an error if the value is forbidden", function() {
    expect(exclusion(within)("quux")).toEqual("value (quux) is forbidden");
    expect(exclusion(within)(false)).toEqual("value (false) is forbidden");
    expect(exclusion(within)(1)).toEqual("value (1) is forbidden");
  });

  it("allows you to customize the message", function() {
    const opts = {within: within, message: "^%{value} is not a valid choice"};
    expect(exclusion(opts)("quux")).toEqual("^quux is not a valid choice");
  });

  it("uses the options as the within list if the options is an array", function() {
    expect(exclusion(["foo", "bar"])("foo")).toBeDefined();
    expect(exclusion(["foo", "bar"])("baz")).not.toBeDefined();
  });

  it("allows functions as messages", function() {
    const message = () => "foobar";
    const options = {message, within: ["foo"]}
    expect(exclusion(options)("foo")).toBe(message());
  });
});
