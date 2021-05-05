import {url} from '../src';

describe('validators.url', function() {


  it("allows empty values", () => {
    expect(url()(null, 'key', {}, {})).not.toBeDefined();
    expect(url()(undefined, 'key', {}, {})).not.toBeDefined();
  });

  it("doesn't allow non strings", () => {
    expect(url()(3.14, 'key', {}, {})).toBeDefined();
    expect(url()(true, 'key', {}, {})).toBeDefined();
    expect(url()({key: 'i`m a string'}, 'key', {}, {})).toBeDefined();
  });

  it("doesn't allow 'invalid' urls", () => {
    const expected = 'is not valid url';

    expect(url()("", 'key', {}, {})).toBeDefined();
    expect(url()(" ", 'key', {}, {})).toBeDefined();
    expect(url()("http://", 'key', {}, {})).toBeDefined();
    expect(url()("http://.", 'key', {}, {})).toBeDefined();
    expect(url()("http://..", 'key', {}, {})).toBeDefined();
    expect(url()("http://../", 'key', {}, {})).toBeDefined();
    expect(url()("http://?", 'key', {}, {})).toBeDefined();
    expect(url()("http://??", 'key', {}, {})).toBeDefined();
    expect(url()("http://??/", 'key', {}, {})).toBeDefined();
    expect(url()("http://#", 'key', {}, {})).toBeDefined();
    expect(url()("http://##", 'key', {}, {})).toBeDefined();
    expect(url()("http://##/", 'key', {}, {})).toBeDefined();
    expect(url()("http://foo.bar?q=Spaces should be encoded", 'key', {}, {})).toBeDefined();
    expect(url()("//", 'key', {}, {})).toBeDefined();
    expect(url()("//a", 'key', {}, {})).toBeDefined();
    expect(url()("///a", 'key', {}, {})).toBeDefined();
    expect(url()("///", 'key', {}, {})).toBeDefined();
    expect(url()("http:///a", 'key', {}, {})).toBeDefined();
    expect(url()("foo.com", 'key', {}, {})).toBeDefined();
    expect(url()("rdar://1234", 'key', {}, {})).toBeDefined();
    expect(url()("h://test", 'key', {}, {})).toBeDefined();
    expect(url()("http:// shouldfail.com", 'key', {}, {})).toBeDefined();
    expect(url()(":// should fail", 'key', {}, {})).toBeDefined();
    expect(url()("http://foo.bar/foo(bar)baz quux", 'key', {}, {})).toBeDefined();
    expect(url()("ftps://foo.bar/", 'key', {}, {})).toBeDefined();
    expect(url()("http://-error-.invalid/", 'key', {}, {})).toBeDefined();
    expect(url()("http://-a.b.co", 'key', {}, {})).toBeDefined();
    expect(url()("http://a.b-.co", 'key', {}, {})).toBeDefined();
    expect(url()("http://0.0.0.0", 'key', {}, {})).toBeDefined();
    expect(url()("http://10.1.1.0", 'key', {}, {})).toBeDefined();
    expect(url()("http://10.1.1.255", 'key', {}, {})).toBeDefined();
    expect(url()("http://224.1.1.1", 'key', {}, {})).toBeDefined();
    expect(url()("http://1.1.1.1.1", 'key', {}, {})).toBeDefined();
    expect(url()("http://123.123.123", 'key', {}, {})).toBeDefined();
    expect(url()("http://3628126748", 'key', {}, {})).toBeDefined();
    expect(url()("http://.www.foo.bar/", 'key', {}, {})).toBeDefined();
    expect(url()("http://www.foo.bar./", 'key', {}, {})).toBeDefined();
    expect(url()("http://.www.foo.bar./", 'key', {}, {})).toBeDefined();
    expect(url()("http://10.1.1.1", 'key', {}, {})).toBeDefined();
    expect(url()("http://localhost", 'key', {}, {})).toBeDefined();
  });

  it("allows valid urls", () => {
    expect(url()("http://foo.com", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://foo.com/", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://foo.com/blah_blah", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://foo.com/blah_blah/", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://foo.com/blah_blah_(wikipedia)", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://foo.com/blah_blah_(wikipedia)_(again)", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://foo.com?query=bar", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://foo.com#fragment=bar", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://www.example.com/wpstyle/?p=364", 'key', {}, {})).not.toBeDefined();
    expect(url()("https://www.example.com/foo/?bar=baz&inga=42&quux", 'key', {}, {})).not.toBeDefined();
    expect(url()("https://www.example.com/foo/#bar=baz&inga=42&quux", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://✪df.ws/123", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://userid:password@example.com:8080", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://userid:password@example.com:8080/", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://userid@example.com", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://userid@example.com/", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://userid@example.com:8080", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://userid@example.com:8080/", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://userid:password@example.com", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://userid:password@example.com/", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://142.42.1.1/", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://142.42.1.1:8080/", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://➡.ws/䨹", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://⌘.ws", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://⌘.ws/", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://foo.com/blah_(wikipedia)#cite-1", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://foo.com/blah_(wikipedia)_blah#cite-1", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://foo.com/unicode_(✪)_in_parens", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://foo.com/(something)?after=parens", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://☺.damowmow.com/", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://code.google.com/events/#&product=browser", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://j.mp", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://foo.bar/?q=Test%20URL-encoded%20stuff", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://مثال.إختبار", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://例子.测试", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://उदाहरण.परीक्षा", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://1337.net", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://a.b-c.de", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://223.255.255.254", 'key', {}, {})).not.toBeDefined();
    expect(url()("http://a.b--c.de/", 'key', {}, {})).not.toBeDefined();
  });

  it("allows local url and private networks if option is set", () => {
    expect(url({allowLocal: true})("http://10.1.1.1", 'key', {}, {})).not.toBeDefined();
    expect(url({allowLocal: true})("http://172.16.1.123", 'key', {}, {})).not.toBeDefined();
    expect(url({allowLocal: true})("http://192.168.1.123", 'key', {}, {})).not.toBeDefined();
    expect(url({allowLocal: true})("http://localhost/foo", 'key', {}, {})).not.toBeDefined();
    expect(url({allowLocal: true})("http://localhost:4711/foo", 'key', {}, {})).not.toBeDefined();
  });

  it("allows data urls", () => {
    //Examples from https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
    expect(url({ allowDataUrl: true })("data:,Hello%2C%20World!", 'key', {}, {})).not.toBeDefined();
    expect(url({ allowDataUrl: true })("data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D", 'key', {}, {})).not.toBeDefined();
    expect(url({ allowDataUrl: true })("data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E", 'key', {}, {})).not.toBeDefined();
  });
});
