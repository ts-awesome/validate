import {numericality, presence, length} from "../src";
import {validate} from '../src/utils';

describe("validate", function() {

  it("raises an error if a promise is returned", function() {
    const constraints = {name: [_ => Promise.resolve() ]};
    expect(function() { validate({}, constraints); }).toThrow();
  });

  it("doesn't fail if the value is a promise", function() {
    const constraints = {name: [_ => undefined]};
    expect(validate({name: Promise.resolve()}, constraints)).not.toBeDefined();
  });

  it("runs as expected", function() {
    const attributes = {
      name: "John Dou",
      email: "john@dou.net",
    };
    const constraints = {
      name: [
        _ => undefined,
      ],
      email: [
        _ => undefined,
        _ => "must be a valid email address",
        _ => "is simply not good enough",
      ],
    };

    expect(validate(attributes, constraints)).toEqual({
      email: [
        "Email must be a valid email address",
        "Email is simply not good enough"
      ]
    });

    expect(validate(attributes, constraints, {format: "flat"})).toEqual([
      "Email must be a valid email address",
      "Email is simply not good enough",
    ]);
  });

  describe("run", function() {
    const {run} = require('../src/utils');

    it("calls the validator with the val, opts, key, attributes and global options", function() {
      let results;
      const attributes = {someAttribute: 'some value'}
      const constraints = {someAttribute: [(...args) => {results = args}]}
      const globalOptions = {someOption: 'some value'};
      run(attributes, constraints, globalOptions);
      expect(results).toEqual([
        'some value',
        'someAttribute',
        attributes,
        globalOptions
      ]);
    });

    it("returns an array of results", function() {
      const globalOptions = {globalOption: "globalValue"}
      const constraints = {name: [
        function fail(_) { return "foobar" },
        function fail2(_) { return ["foo", "bar"] },
        function pass(_) { return undefined },
      ]}
      const attributes = {name: "test"};
      const result = run(attributes, constraints, globalOptions);

      expect(result).toEqual([{
        attribute: "name",
        value: "test",
        validator: "fail",
        error: "foobar"
      }, {
        attribute: "name",
        value: "test",
        validator: "fail2",
        error: "foo"
      }, {
        attribute: "name",
        value: "test",
        validator: "fail2",
        error: "bar"
      }]);
    });

    it("validates all attributes", function() {
      function fail() { return "error" }
      const constraints = {
        attr1: [_ => undefined],
        attr2: [fail],
        attr3: [fail],
      };
      expect(run({}, constraints, {})).toEqual([
        {
          attribute: "attr2",
          value: undefined,
          validator: "fail",
          error: "error"
        }, {
          attribute: "attr3",
          value: undefined,
          validator: "fail",
          error: "error"
        }
      ]);
    });

    it("calls custom prettify in global options", function() {
      const prettifyArgs: any[] = [];
      function prettify(arg) {
        prettifyArgs.push(arg);
        return "foobar";
      }
      const constraints = {foo: [presence()]}
      const options = {format: 'flat' as never, prettify};
      expect(validate({}, constraints, options)).toEqual(["Foobar can't be blank"]);
      expect(prettifyArgs).toEqual(["foo", undefined]);
    });

    it("calls custom prettify in global options inside numericality validator", function() {
      const prettifyArgs: any[] = [];
      function prettify(arg) {
        prettifyArgs.push(arg);
        return "foobar";
      }
      const constraints = {foo: [numericality({greaterThan: 0})]};
      const options = {format: 'flat' as never, prettify};
      expect(validate({foo: 0}, constraints, options)).toEqual(["Foobar must be foobar 0"]);
      expect(prettifyArgs).toEqual(["greaterThan", "foo", 0]);
    });
  });

  describe("format", function() {

    describe("flat", function() {
      it("returns a flat list of errors", function() {
        const constraints = {
          foo: [
            presence(),
            numericality(),
            length({
              is: 23,
              wrongLength: "some error"
            })
          ]
        };
        expect(validate({foo: "bar"}, constraints, {format: "flat"})).toEqual([
          "Foo is not a number",
          "Foo some error",
        ]);
      });

      it("fullMessages = false", function() {
        const constraints = {foo: [presence()]}
        const options = {format: 'flat' as never, fullMessages: false};
        expect(validate({}, constraints, options)).toEqual(["can't be blank"]);
      });

      it("deduplicates errors", function() {
        const constraints = {
          foo: [
            numericality({
              message: "some error"
            }),
            length({
              is: 23,
              wrongLength: "some error"
            })
          ]
        };
        expect(validate({foo: "bar"}, constraints, {format: "flat"})).toEqual([
          "Foo some error"
        ]);
      });
    });

    describe("grouped", function() {
      it("deduplicates errors", function() {
        const constraints = {
          foo: [
            numericality({
              message: "some error"
            }),
            length({
              is: 23,
              wrongLength: "some error"
            }),
          ]
        };
        expect(validate({foo: "bar"}, constraints)).toEqual({
          foo: ["Foo some error"]
        });
      });
    });

    describe("detailedErrors", function() {
      it("allows you to get more info about the errors", function() {
        const attributes = {
          foo: "foo",
          bar: 10
        };
        const constraints = {
          foo: [
            presence(),
            length({
              is: 15,
              message: "^foobar",
              someOption: "someValue"
            }),
          ],
          bar: [
            numericality({
              lessThan: 5,
              greaterThan: 15
            }),
          ]
        };
        const options = {format: 'raw' as never};
        expect(validate(attributes, constraints, options)).toEqual([{
          attribute: "foo",
          value: "foo",
          validator: "LengthValidator",
          error: "foobar"
        }, {
          attribute: "bar",
          value: 10,
          validator: "NumericalityValidator",
          error: "Bar must be greater than 15"
        }, {
          attribute: "bar",
          value: 10,
          validator: "NumericalityValidator",
          error: "Bar must be less than 5"
        }]);
      });
    });
  });
});
