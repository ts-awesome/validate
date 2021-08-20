import {length} from "../src";

describe('validator.length', function() {



    it("allows you to specify a fixed length the object has to be", () => {
      const value = {length: 10}
      const options = {is: 10};
      expect(length(options)(value, 'key', {}, {})).not.toBeDefined();

      options.is = 11;
      const expected = ["is the wrong length (should be 11 characters)"];
      expect(length(options)(value, 'key', {}, {})).toEqual(expected);
    });


    it("allows you to specify a minimum value", () => {
      const  value = {length: 10}
      const options = {minimum: 10};
      expect(length(options)(value, 'key', {}, {})).not.toBeDefined();

      options.minimum = 11;
      const expected = ["is too short (minimum is 11 characters)"];
      expect(length(options)(value, 'key', {}, {})).toEqual(expected);
    });


    it("allows you to specify a maximum value", () => {
      const value = {length: 11}
      const options = {maximum: 11};
      expect(length(options)(value, 'key', {}, {})).not.toBeDefined();

      options.maximum = 10;
      const expected = ["is too long (maximum is 10 characters)"];
      expect(length(options)(value, 'key', {}, {})).toEqual(expected);
    });

  it("allows empty values", () => {
    const options = {is: 10, minimum: 20, maximum: 5};
    expect(length(options)(null, 'key', {}, {})).not.toBeDefined();
    expect(length(options)(undefined, 'key', {}, {})).not.toBeDefined();
  });

  it("refuses values without a numeric length property", () => {
    const options = {is: 10, minimum: 10, maximum: 20};
    expect(length(options)(3.1415, 'key', {}, {})).toBeDefined();
    expect(length(options)(-3.1415, 'key', {}, {})).toBeDefined();
    expect(length(options)(0, 'key', {}, {})).toBeDefined();
    expect(length(options)({foo: "bar"}, 'key', {}, {})).toBeDefined();
    expect(length(options)({lengthi: 10}, 'key', {}, {})).toBeDefined();
    expect(length(options)({length: "foo"}, 'key', {}, {})).toBeDefined();
    expect(length(options)(3, 'key', {}, {})).toBeDefined();
  });


  it("allows you to specify is, minimum and maximum", () => {
    const options = {
      is: 10,
      minimum: 20,
      maximum: 5
    };
    expect(length(options)({length: 9},  'key', {}, {})).toHaveLength(3);
    expect(length(options)("foobar", 'key', {},{} )).toHaveLength(3);
    expect(length(options)("", 'key', {}, {})).toHaveLength(2);
    expect(length(options)(" ", 'key', {}, {})).toHaveLength(2);
  });

  it("return the message only once if specified", () => {
    const value = {length: 9}
    const options = {
      message: "my message",
      is: 10,
      minimum: 20,
      maximum: 5
    };
    expect(length(options)(value, 'key', {}, {})).toBe("my message");
  });

  it("doesn't override specific messages with the default one", function() {
    const value = {length: 3}
    const options = {
      is: 2,
      minimum: 4,
      maximum: 2,
      wrongLength: "wrongLength",
      tooLong: "tooLong",
      tooShort: "tooShort"
    };
  });
    it("allows you to count words for example", () => {
      const options = {
        maximum: 2,
        tokenizer: function(value) { return value.split(/\s+/g); }
      };

      expect(length(options)("foo bar", 'key', {}, {})).not.toBeDefined();
      expect(length(options)("foo bar baz", 'key', {}, {})).toBeDefined();
    });
});
