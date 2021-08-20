import {boolean} from "../src";

describe('validators.boolean', function () {
  it('allows not defined values', () => {
    expect(boolean()(undefined, 'key', {}, {})).not.toBeDefined();
    expect(boolean()(null, 'key', {}, {})).not.toBeDefined();
  });
  it('must be boolean', () => {
    const e = "must be a boolean";
    expect(boolean()('stu', 'key', {}, {})).toEqual(e);
    expect(boolean()(1, 'key', {}, {})).toEqual(e);
    expect(boolean()([], 'key', {}, {})).toEqual(e);
  })
  it('equal to opt value', () => {
    expect(boolean({equalTo: true})(false, 'key', {}, {})).toEqual('must be equal true');
  })
})
