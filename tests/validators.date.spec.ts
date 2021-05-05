import {datetime, date} from "../src";

describe('validators.datetime', function () {
  it("allows undefined values", () => {
    expect(datetime()(null, 'key', {}, {})).not.toBeDefined();
    expect(datetime()(undefined, 'key', {}, {})).not.toBeDefined();
  });
  it("allows valid datetimes", () => {
    expect(date()("2017-11-27", 'key', {}, {})).not.toBeDefined();
  });
  it("doesn't allow invalid datetimes", () => {
    const expected = 'must be a date string or Date instance';
    expect(datetime()([], 'key', {}, {})).toEqual(expected);
    expect(datetime()(1, 'key', {}, {})).toEqual(expected);
    expect(datetime()({}, 'key', {}, {})).toEqual(expected);
  });


  it('expects invalid format', () => {
    expect(date({format:  "yyyy-MM-dd'T'HH:mm:ss.SSSX"})('2017-08-02T06:05:30.000Z', 'key', {}, {})).toEqual("has invalid format (expected yyyy-MM-dd'T'HH:mm:ss.SSSX)")
  })

})
