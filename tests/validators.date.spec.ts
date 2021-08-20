import {datetime, date} from "../src";

describe('validators.datetime', function () {
  beforeEach(() => {
    process.env.TZ = 'UTC';
  });

  afterEach(() => {
    delete process.env.TZ;
  });

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
    const validator = datetime({format:  "yyyy-MM-dd' 'HH:mm:ss"});
    const actual = validator('2017-08-02 21:00', 'key', {}, {});
    expect(actual).toEqual("has invalid format (expected yyyy-MM-dd' 'HH:mm:ss)")
  })

})
