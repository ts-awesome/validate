import {datetime, date} from "../src";
import { ValidatorOptions } from "../src/interfaces";
import { DateTimeOptions } from "../src/validators/datetime";

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



describe('validators.date', function () {
  beforeEach(() => {
    process.env.TZ = 'UTC';
  });

  afterEach(() => {
    delete process.env.TZ;
  });

  it("allows undefined values", () => {
    expect(date()(null, 'key', {}, {})).not.toBeDefined();
    expect(date()(undefined, 'key', {}, {})).not.toBeDefined();
  });
  it("allows valid datetimes", () => {
    expect(date()("2017-11-27", 'key', {}, {})).not.toBeDefined();
  });
  it("doesn't allow invalid datetimes", () => {
    const expected = 'must be a date string or Date instance';
    expect(date()([], 'key', {}, {})).toEqual(expected);
    expect(date()(1, 'key', {}, {})).toEqual(expected);
    expect(date()({}, 'key', {}, {})).toEqual(expected);
  });


  it('expects invalid format', () => {
    const validator = datetime({format:  "yyyy-MM-dd' 'HH:mm:ss"});
    const actual = validator('2017-08-02 21:00', 'key', {}, {});
    expect(actual).toEqual("has invalid format (expected yyyy-MM-dd' 'HH:mm:ss)")
  })

  it('should let you to define a range of valid dates between earliest and latest', () => {
    const earliest = '2000-01-01'
    const latest = '2020-01-01'

    const tooEarly = '1999-12-31'
    const validDate = '2011-03-10'
    const tooLate = '2020-01-02'

    const optionSets: ValidatorOptions<DateTimeOptions>[] = [
      {
        earliest,
        latest
      },
      {
        earliest: new Date(earliest),
        latest: new Date(latest)
      },
      {
        earliest: () => earliest,
        latest: () => latest
      },
      {
        earliest: () => new Date(earliest),
        latest: () => new Date(latest)
      }
    ]


    for (let i = 0; i < optionSets.length; i++) {
      const validator = date(optionSets[i])

      expect(validator(tooEarly, 'key', {}, {})).toBeDefined()
      expect(validator(tooLate, 'key', {}, {})).toBeDefined()

      expect(validator(earliest, 'key', {}, {})).toBeUndefined()
      expect(validator(validDate, 'key', {}, {})).toBeUndefined()
      expect(validator(latest, 'key', {}, {})).toBeUndefined()
    }
  })
})
