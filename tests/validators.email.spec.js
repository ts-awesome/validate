describe('validators.email', function() {
  let {email} = require('../dist/validators/email');

  it("allows undefined values", () => {
    expect(email()(null)).not.toBeDefined();
    expect(email()(undefined)).not.toBeDefined();
  });

  it("doesn't allow non strings", () => {
    expect(email()(3.14)).toBeDefined();
    expect(email()(true)).toBeDefined();
  });

  it("allows valid emails", () => {
    expect(email()('nicklas@ansman.se')).not.toBeDefined();
    expect(email()('NiCkLaS@AnSmAn.Se')).not.toBeDefined();
    // Source: https://en.wikipedia.org/wiki/Email_address#Valid_email_addresses
    expect(email()('niceandsimple@example.com')).not.toBeDefined();
    expect(email()('very.common@example.com')).not.toBeDefined();
    expect(email()('a.little.lengthy.but.fine@dept.example.com')).not.toBeDefined();
    expect(email()('disposable.style.email.with+symbol@example.com')).not.toBeDefined();
    expect(email()('other.email-with-dash@example.com')).not.toBeDefined();
    expect(email()("foo@some.customtld")).not.toBeDefined();
  });

  it("doesn't allow 'invalid' emails", () => {
    expect(email()("")).toEqual("should be a valid email");
    expect(email()(" ")).toEqual("should be a valid email");
    expect(email()("foobar")).toEqual("should be a valid email");
    expect(email()("foo@bar")).toEqual("should be a valid email");
    expect(email()('üñîçøðé@example.com')).toEqual("should be a valid email");
    // Source: https://en.wikipedia.org/wiki/Email_address#Invalid_email_addresses
    expect(email()('abc.example.com')).toEqual("should be a valid email");
    expect(email()('a@b@c@example.com')).toEqual("should be a valid email");
    expect(email()('a"b(c)d,e:f;g<h>i[j\\k]l@example.com')).toEqual("should be a valid email");
    expect(email()('just"not"right@example.com')).toEqual("should be a valid email");
    expect(email()('this is"not\\allowed@example.com')).toEqual("should be a valid email");
    expect(email()('this\\ still\\"not\\\\allowed@example.com')).toEqual("should be a valid email");
  });

  it("allows you to customize the error message", () => {
    expect(email({message: "some other message"})("foobar")).toEqual("some other message");
  });

  it("allows functions as messages", () => {
    const message = () => "foo";
    expect(email({message})("foo")).toBe(message());
  });
});
