import {password} from "../src";

describe('validator.password', function() {

  it("should be at least 8 characters", function() {
    expect(password()('0B!defgh', 'password',{}, {})).toBeUndefined();
    expect(password()('A0!DEFG', 'password',{}, {})).toBeDefined();
  });

  it("should be at most 63 characters", function() {
    expect(password()('012345678901234567890123456789012345678901234567890123456789aB!', 'password',{}, {})).toBeUndefined();
    expect(password()('012345678901234567890123456789012345678901234567890123456789aB!4', 'password',{}, {})).toBeDefined();
  });

  describe('complexity:low', function () {
    const _ = password('low')

    it("should fail", function() {
      expect(_('12345678', 'password',{}, {})).toBeDefined();
    });

    it("should pass", function() {
      expect(_('abcdefgh', 'password',{}, {})).toBeUndefined();
      expect(_('ABCDEFGH', 'password',{}, {})).toBeUndefined();
      expect(_('!@#$%^&*', 'password',{}, {})).toBeUndefined();
      expect(_('abcd1234', 'password',{}, {})).toBeUndefined();
      expect(_('abcdEFGH', 'password',{}, {})).toBeUndefined();
      expect(_('ABCD1234', 'password',{}, {})).toBeUndefined();
      expect(_('abcd!@#$', 'password',{}, {})).toBeUndefined();
      expect(_('ABCD1@#$', 'password',{}, {})).toBeUndefined();
      expect(_('ABcd1234', 'password',{}, {})).toBeUndefined();
      expect(_('ABcd12!@', 'password',{}, {})).toBeUndefined();
    });
  });


  describe('complexity:weak', function () {
    const _ = password('weak')

    it("should fail", function() {
      expect(_('12345678', 'password',{}, {})).toBeDefined();
      expect(_('abcdefgh', 'password',{}, {})).toBeDefined();
      expect(_('ABCDEFGH', 'password',{}, {})).toBeDefined();
      expect(_('!@#$%^&*', 'password',{}, {})).toBeDefined();
    });

    it("should pass", function() {
      expect(_('abcd1234', 'password',{}, {})).toBeUndefined();
      expect(_('ABCD1234', 'password',{}, {})).toBeUndefined();
      expect(_('abcdEFGH', 'password',{}, {})).toBeUndefined();
      expect(_('abcd!@#$', 'password',{}, {})).toBeUndefined();
      expect(_('ABCD1@#$', 'password',{}, {})).toBeUndefined();
      expect(_('ABcd1234', 'password',{}, {})).toBeUndefined();
      expect(_('ABcd12!@', 'password',{}, {})).toBeUndefined();
    });
  });


  describe('complexity:medium', function () {
    const _ = password('medium')

    it("should fail", function() {
      expect(_('12345678', 'password',{}, {})).toBeDefined();
      expect(_('abcdefgh', 'password',{}, {})).toBeDefined();
      expect(_('ABCDEFGH', 'password',{}, {})).toBeDefined();
      expect(_('!@#$%^&*', 'password',{}, {})).toBeDefined();
      expect(_('abcd1234', 'password',{}, {})).toBeDefined();
      expect(_('ABCD1234', 'password',{}, {})).toBeDefined();
      expect(_('abcdEFGH', 'password',{}, {})).toBeDefined();
      expect(_('abcd!@#$', 'password',{}, {})).toBeDefined();
      expect(_('ABCD1@#$', 'password',{}, {})).toBeDefined();
    });

    it("should pass", function() {
      expect(_('ABcd1234', 'password',{}, {})).toBeUndefined();
      expect(_('ABcd12!@', 'password',{}, {})).toBeUndefined();
    });
  });


  describe('complexity:strong', function () {
    const _ = password('strong')

    it("should fail", function() {
      expect(_('12345678', 'password',{}, {})).toBeDefined();
      expect(_('abcdefgh', 'password',{}, {})).toBeDefined();
      expect(_('ABCDEFGH', 'password',{}, {})).toBeDefined();
      expect(_('!@#$%^&*', 'password',{}, {})).toBeDefined();
      expect(_('abcd1234', 'password',{}, {})).toBeDefined();
      expect(_('ABCD1234', 'password',{}, {})).toBeDefined();
      expect(_('abcdEFGH', 'password',{}, {})).toBeDefined();
      expect(_('abcd!@#$', 'password',{}, {})).toBeDefined();
      expect(_('ABCD1@#$', 'password',{}, {})).toBeDefined();
      expect(_('ABcd1234', 'password',{}, {})).toBeDefined();

    });

    it("should pass", function() {
      expect(_('ABcd12!@', 'password',{}, {})).toBeUndefined();
    });
  });


  describe('complexity:extra-strong', function () {
    const _ = password('extra-strong' as never)

    it("should fail", function() {
      expect(_('123456789012', 'password',{}, {})).toBeDefined();
      expect(_('abcdefghabcd', 'password',{}, {})).toBeDefined();
      expect(_('ABCDEFGHABCD', 'password',{}, {})).toBeDefined();
      expect(_('!@#$%^&*!@#$', 'password',{}, {})).toBeDefined();
      expect(_('abcd1234ab12', 'password',{}, {})).toBeDefined();
      expect(_('ABCD1234AB12', 'password',{}, {})).toBeDefined();
      expect(_('abcdEFGHabEF', 'password',{}, {})).toBeDefined();
      expect(_('abcd!@#$abcd', 'password',{}, {})).toBeDefined();
      expect(_('ABCD1@#$ABCD', 'password',{}, {})).toBeDefined();
      expect(_('ABcd1234ABcd', 'password',{}, {})).toBeDefined();
      expect(_('ABcd12!@', 'password',{}, {})).toBeDefined();

    });

    it("should pass", function() {
      expect(_('ABcd12!@____', 'password',{}, {})).toBeUndefined();
    });
  });

})
