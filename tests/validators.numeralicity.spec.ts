import {numericality} from "../src";

describe("validators.numericality", function (){

  it("allows empty values", () => {
    expect(numericality()(null, 'key', {}, {})).not.toBeDefined();
    expect(numericality()(undefined, 'key', {}, {})).not.toBeDefined();
  });

  it("allows numbers", () => {
    expect(numericality()(3.14, 'key', {}, {})).not.toBeDefined();
    expect(numericality()("3.14", 'key', {}, {})).not.toBeDefined();
  });

  it("doesn't allow non numbers", () => {
    const e = "is not a number";
    expect(numericality()("", 'key', {}, {})).toEqual(e);
    expect(numericality()("  ", 'key', {}, {})).toEqual(e);
    expect(numericality()("foo", 'key', {}, {})).toEqual(e);
    expect(numericality()(NaN, 'key', {}, {})).toEqual(e);
    expect(numericality()(false, 'key', {}, {})).toEqual(e);
    expect(numericality()([1], 'key', {}, {})).toEqual(e);
    expect(numericality()({foo: "bar"}, 'key', {}, {})).toEqual(e);
  });

  it("doesn't allow strings if noStrings is true", () => {
    expect(numericality({noStrings: true})("3.14", 'key', {}, {})).toBeDefined();
  });

    it("allows integers", () => {
      expect(numericality()(1, 'key', {}, {})).not.toBeDefined();
    });

    it("doesn't allow real numbers", () => {
      const expected = "must be an integer";
      expect(numericality({onlyInteger: true})(3.14, 'key', {}, {})).toEqual(expected);
    });


    it("allows numbers that are greater than", () => {
      expect(numericality({greaterThan: 2.72})(3.14, 'key', {}, {})).not.toBeDefined();
    });

    it("doesn't allow numbers that are smaller than or equal to", () => {
      const expected = ["must be greater than 3.14"];
      expect(numericality({greaterThan: 3.14})(3.14, 'key', {}, {})).toEqual(expected);
      expect(numericality({greaterThan: 3.14})(2.72, 'key', {}, {})).toEqual(expected);
    });

    it("allows numbers that are greater than or equal to", () => {
      expect(numericality({greaterThanOrEqualTo: 2.72})(3.14, 'key', {}, {})).not.toBeDefined();
      expect(numericality({greaterThanOrEqualTo: 2.72})(2.72, 'key', {}, {})).not.toBeDefined();
    });

    it("doesn't allow numbers that are smaller than", () => {
      const expected = ["must be greater than or equal to 3.14"];
      expect(numericality({greaterThanOrEqualTo: 3.14})(2.72, 'key', {}, {})).toEqual(expected);
    });

    it("allows numbers that are equal to", () => {
      expect(numericality({equalTo: 2.72})(2.72, 'key', {}, {})).not.toBeDefined();
    });

    it("doesn't allow numbers that are not equal", () => {
      const expected = ["must be equal to 2.72"];
      expect(numericality({equalTo: 2.72})(3.14, 'key', {}, {})).toEqual(expected);
    });

    it("allows numbers that are less than", () => {
      expect(numericality({lessThan: 3.14})(2.72, 'key', {}, {})).not.toBeDefined();
    });

    it("doesn't allow numbers that are greater than or equal to", () => {
      const expected = ["must be less than 2.72"];
      expect(numericality({lessThan: 2.72})(2.72, 'key', {}, {})).toEqual(expected);
      expect(numericality({lessThan: 2.72})(3.14, 'key', {}, {})).toEqual(expected);
    });

    it("allows numbers that are less than or equal to", () => {
      expect(numericality({lessThanOrEqualTo: 3.14})(2.72, 'key', {}, {})).not.toBeDefined();
      expect(numericality({lessThanOrEqualTo: 3.14})(3.14, 'key', {}, {})).not.toBeDefined();
    });

    it("doesn't allow numbers that are greater than", () => {
      const expected = ["must be less than or equal to 2.72"];
      expect(numericality({lessThanOrEqualTo: 2.72})(3.14, 'key', {}, {})).toEqual(expected);
    });


    it("allows numbers divisible by the value", () => {
      expect(numericality({divisibleBy: 2})(0, 'key', {}, {})).not.toBeDefined();
      expect(numericality({divisibleBy: 5})(5, 'key', {}, {})).not.toBeDefined();
      expect(numericality({divisibleBy: 8})(16, 'key', {}, {})).not.toBeDefined();
    });

    it("doesn't allow numbers that are not divisible by the given number", () => {
      const expected = ["must be divisible by 100"];
      expect(numericality({divisibleBy: 100})(121, 'key', {}, {})).toEqual(expected);
    });

    it("allows odd numbers", () => {
      expect(numericality({odd: true})(1, 'key', {}, {})).not.toBeDefined();
      expect(numericality({odd: true})(3, 'key', {}, {})).not.toBeDefined();
      expect(numericality({odd: true})(5, 'key', {}, {})).not.toBeDefined();
    });

    it("disallows even numbers", () => {
      var expected = ["must be odd"];
      expect(numericality({odd: true})(0, 'key', {}, {})).toEqual(expected);
      expect(numericality({odd: true})(2, 'key', {}, {})).toEqual(expected);
      expect(numericality({odd: true})(4, 'key', {}, {})).toEqual(expected);
    });

    it("allows even numbers", () => {
      expect(numericality({even: true})(0, 'key', {}, {})).not.toBeDefined();
      expect(numericality({even: true})(2, 'key', {}, {})).not.toBeDefined();
      expect(numericality({even: true})(4, 'key', {}, {})).not.toBeDefined();
    });

    it("disallows odd numbers", () => {
      var expected = ["must be even"];
      expect(numericality({even: true})(1, 'key', {}, {})).toEqual(expected);
      expect(numericality({even: true})(3, 'key', {}, {})).toEqual(expected);
      expect(numericality({even: true})(5, 'key', {}, {})).toEqual(expected);
    });

    it("disallows prefixed zeros", () => {
      expect(numericality({strict: true})("01.0", 'key', {}, {}))
        .toEqual("must be a valid number");
      expect(numericality({strict: true})("0001.0000000", 'key', {}, {}))
        .toEqual("must be a valid number");
      expect(numericality({strict: true})("020", 'key', {}, {}))
        .toEqual("must be a valid number");
      expect(numericality({strict: true, onlyInteger: true})("1.00", 'key', {}, {}))
        .toEqual("must be a valid number");
      expect(numericality({strict: true})("1.", 'key', {}, {}))
        .toEqual("must be a valid number");
      expect(numericality({strict: true, onlyInteger: true})("1.", 'key', {}, {}))
        .toEqual("must be a valid number");
      expect(numericality({strict: true})(".0", 'key', {}, {}))
        .toEqual("must be a valid number");
      expect(numericality({strict: true})(".1", 'key', {}, {}))
        .toEqual("must be a valid number");
      expect(numericality({strict: true})("1.00", 'key', {}, {})).not.toBeDefined();
      expect(numericality({strict: true})("1.0", 'key', {}, {})).not.toBeDefined();
      expect(numericality({strict: true})(10, 'key', {}, {})).not.toBeDefined();
      expect(numericality({strict: true})("10", 'key', {}, {})).not.toBeDefined();
      expect(numericality({strict: true})("0.1", 'key', {}, {})).not.toBeDefined();
      expect(numericality({strict: true})("0", 'key', {}, {})).not.toBeDefined();
      expect(numericality({strict: true})("-3", 'key', {}, {})).not.toBeDefined();
    });
});
