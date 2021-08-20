import {uuid} from "../src";

describe('validators.uuid', function () {
  it('allows not defined values', () => {
    expect(uuid()(undefined, 'key', {}, {})).not.toBeDefined();
    expect(uuid()(null, 'key', {}, {})).not.toBeDefined();
  });
  it('allows only string', () => {
    const e = "must be a string";
    expect(uuid()({}, 'key', {}, {})).toEqual(e);
    expect(uuid()([], 'key', {}, {})).toEqual(e);
    expect(uuid()(1, 'key', {}, {})).toEqual(e);
    expect(uuid()(true, 'key', {}, {})).toEqual(e);
  });
  it('allows only correct version of uuid', () => {
    const e = "is not valid uuid of version 1"
    expect(uuid(1)('qweqwe-qweqwe', 'key', {}, {})).toEqual(e);
  })
})
