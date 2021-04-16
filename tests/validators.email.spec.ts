import {email} from "../src";

describe('validators.email', function() {
  it("allows undefined values", () => {
    expect(email()(null, 'key', {}, {})).not.toBeDefined();
    expect(email()(undefined, 'key', {}, {})).not.toBeDefined();
  });

  it("doesn't allow non strings", () => {
    expect(email()(3.14, 'key', {}, {})).toBeDefined();
    expect(email()(true, 'key', {}, {})).toBeDefined();
  });

  it("allows valid emails", () => {
    expect(email()('nicklas@ansman.se', 'key', {}, {})).not.toBeDefined();
    expect(email()('NiCkLaS@AnSmAn.Se', 'key', {}, {})).not.toBeDefined();
    // Source: https://en.wikipedia.org/wiki/Email_address#Valid_email_addresses
    expect(email()('niceandsimple@example.com', 'key', {}, {})).not.toBeDefined();
    expect(email()('very.common@example.com', 'key', {}, {})).not.toBeDefined();
    expect(email()('a.little.lengthy.but.fine@dept.example.com', 'key', {}, {})).not.toBeDefined();
    expect(email()('disposable.style.email.with+symbol@example.com', 'key', {}, {})).not.toBeDefined();
    expect(email()('other.email-with-dash@example.com', 'key', {}, {})).not.toBeDefined();
    expect(email()("foo@some.customtld", 'key', {}, {})).not.toBeDefined();
  });

  it("doesn't allow 'invalid' emails", () => {
    expect(email()("", 'key', {}, {})).toEqual("should be a valid email");
    expect(email()(" ", 'key', {}, {})).toEqual("should be a valid email");
    expect(email()("foobar", 'key', {}, {})).toEqual("should be a valid email");
    expect(email()("foo@bar", 'key', {}, {})).toEqual("should be a valid email");
    expect(email()('üñîçøðé@example.com', 'key', {}, {})).toEqual("should be a valid email");
    // Source: https://en.wikipedia.org/wiki/Email_address#Invalid_email_addresses
    expect(email()('abc.example.com', 'key', {}, {})).toEqual("should be a valid email");
    expect(email()('a@b@c@example.com', 'key', {}, {})).toEqual("should be a valid email");
    expect(email()('a"b(c)d,e:f;g<h>i[j\\k]l@example.com', 'key', {}, {})).toEqual("should be a valid email");
    expect(email()('just"not"right@example.com', 'key', {}, {})).toEqual("should be a valid email");
    expect(email()('this is"not\\allowed@example.com', 'key', {}, {})).toEqual("should be a valid email");
    expect(email()('this\\ still\\"not\\\\allowed@example.com', 'key', {}, {})).toEqual("should be a valid email");
  });

  it("allows you to customize the error message", () => {
    expect(email({message: "some other message"})("foobar", 'key', {}, {})).toEqual("some other message");
  });

  it("allows functions as messages", () => {
    const message = () => "foo";
    expect(email({message})("foo", 'key', {}, {})).toBe(message());
  });
});
