import {date} from "../src";

describe('validators.date', function () {
  it("allows undefined values", () => {
    expect(date()(null, 'key', {}, {})).not.toBeDefined();
    expect(date()(undefined, 'key', {}, {})).not.toBeDefined();
  });
  it("allows valid dates", () => {
    expect(date()("2017-11-27T20:13:24.000+00:00", 'key', {}, {})).not.toBeDefined();
  });
  it("doesn't allow invalid dates", () => {
    const expected = 'must be a date string or Date instance';
    expect(date()('foobar', 'key', {}, {})).toEqual(expected);
    expect(date()('', 'key', {}, {})).toEqual(expected);
    expect(date()('    ', 'key', {}, {})).toEqual(expected);
  });
  it("allows tooLate, tooEarly and notValid messages", () => {
    const options = {
      tooLate: '%{value} is later than %{date}',
      tooEarly: '%{value} is earlier than %{date}',
      notValid: '%{value} is not valid',
      message: 'fail',
      earliest: '2015-01-01',
      latest: '2015-12-31',
    };
    expect(date({options})('foobar', 'key', {options}, {})).toEqual("foobar is not valid");
    expect(date({options})('2014-01-01','', {}, {}))
      .toEqual(["2014-01-01 is earlier than 2015-01-01"]);
    expect(date({options})('2016-01-01', 'key', {}, {}))
      .toEqual(["2016-01-01 is later than 2015-12-31"]);
  });
  it("message overrides global messages", () => {
    const options = {
      message: 'some message',
      earliest: '2016-01-01',
      latest: '2015-12-30',
    };
    expect(date({options})('foobar', 'key', {}, {})).toEqual('some message');
    expect(date({options})('2015-12-31', 'key', {}, {})).toEqual(['some message']);
  });

})
