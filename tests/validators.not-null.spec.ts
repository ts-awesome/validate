import {notNull} from "../src";

describe('validator.notNull', function (){
  it('does not allow null', () => {
    const e = 'should not be null';
    expect(notNull()(null, 'key', {}, {})).not.toBeDefined();
    expect(notNull()('Test qwerty', 'key', {}, {})).not.toBeDefined();
  })
});
