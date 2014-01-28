
function test(input, expected) {
  expect(URI(input)).toEqual(expected);
}

describe( 'URI Regular Expression', function() {
  
  it( 'should match a (commonly found) URI', function() {
    test( 'http://user:password@example.com:8080/some/path/to/somewhere?search=regex&order=desc#fragment', {
      uri : 'http://user:password@example.com:8080/some/path/to/somewhere?search=regex&order=desc#fragment', 
      uri_hierarchical_part : 'http://user:password@example.com:8080/some/path/to/somewhere', 
      protocol: 'http',
      slashes: '//',
      authority: 'user:password',
      host: 'example.com',
      port: '8080',
      path: '/some/path/to/somewhere',
      query: 'search=regex&order=desc',
      hash: 'fragment',
      prelude: '',
      postlude: ''
    });
  });
  
  it( 'should match URIs with URI as hostname', function() {
    test( 'mina:tcp://mainframeip:4444?textline=true', {
      uri : 'mina:tcp://mainframeip:4444?textline=true', 
      uri_hierarchical_part : 'mina:tcp://mainframeip:4444', 
      protocol: 'mina',
      slashes: undefined,
      authority: undefined,
      host: undefined,
      port: undefined,
      path: 'tcp://mainframeip:4444',
      query: 'textline=true',
      hash: undefined,
      prelude: '',
      postlude: ''
    });
  });
  
  it( 'should match IPv6 hosts', function() {
    test( 'ldap://[2001:db8::7]/c=GB?objectClass?one', {
      uri : 'ldap://[2001:db8::7]/c=GB?objectClass?one', 
      uri_hierarchical_part : 'ldap://[2001:db8::7]/c=GB', 
      protocol: 'ldap',
      slashes: '//',
      authority: undefined,
      host: '[2001:db8::7]',
      port: undefined,
      path: '/c=GB',
      query: 'objectClass?one',
      hash: undefined,
      prelude: '',
      postlude: ''
    });
  });
  
  it( 'should match URIs w/o authority', function() {
    test( 'urn:oasis:names:specification:docbook:dtd:xml:4.1.2', {
      uri : 'urn:oasis:names:specification:docbook:dtd:xml:4.1.2', 
      uri_hierarchical_part : 'urn:oasis:names:specification:docbook:dtd:xml:4.1.2', 
      protocol: 'urn',
      slashes: undefined,
      authority: undefined,
      host: undefined,
      port: undefined,
      path: 'oasis:names:specification:docbook:dtd:xml:4.1.2',
      query: undefined,
      hash: undefined,
      prelude: '',
      postlude: ''
    });
  });
  
  it( 'should match unicode hostnames', function() {
    test( 'https://www.日本平.jp', {
      uri : 'https://www.日本平.jp', 
      uri_hierarchical_part : 'https://www.日本平.jp', 
      protocol: 'https',
      slashes: '//',
      authority: undefined,
      host: 'https://www.日本平.jp',
      port: undefined,
      path: undefined,
      query: undefined,
      hash: undefined,
      prelude: '',
      postlude: ''
    });
  });
  
  it( 'should match punycode hostnames', function() {
    test( 'http://www.xn--gwtq9nb2a.jp', {
      uri : 'http://www.xn--gwtq9nb2a.jp', 
      uri_hierarchical_part : 'http://www.xn--gwtq9nb2a.jp', 
      protocol: 'http',
      slashes: '//',
      authority: undefined,
      host: 'www.xn--gwtq9nb2a.jp',
      port: undefined,
      path: undefined,
      query: undefined,
      hash: undefined,
      prelude: '',
      postlude: ''
    });
  });
  
  it( 'should match percent encoded parts', function() {
    test( 'http://www.fran%c3%a7ois.fr/fran%c3%a7ois', {
      uri : 'http://www.fran%c3%a7ois.fr/fran%c3%a7ois', 
      uri_hierarchical_part : 'http://www.fran%c3%a7ois.fr/fran%c3%a7ois', 
      protocol: 'http',
      slashes: '//',
      authority: undefined,
      host: 'www.fran%c3%a7ois.fr',
      port: undefined,
      path: '/fran%c3%a7ois',
      query: undefined,
      hash: undefined,
      prelude: '',
      postlude: ''
    });
  });
  
  describe( 'should match RFC 3986\'s example URIs', function() {
    it( 'for FTP', function() {
      test( 'ftp://ftp.is.co.za/rfc/rfc1808.txt', {
        uri : 'ftp://ftp.is.co.za/rfc/rfc1808.txt', 
        uri_hierarchical_part : 'ftp://ftp.is.co.za/rfc/rfc1808.txt', 
        protocol: 'ftp',
        slashes: '//',
        authority: undefined,
        host: 'ftp.is.co.za',
        port: undefined,
        path: '/rfc/rfc1808.txt',
        query: undefined,
        hash: undefined,
        prelude: '',
        postlude: ''
      });
    });
    it( 'for HTTP', function() {
      test( 'http://www.ietf.org/rfc/rfc2396.txt', {
        uri : 'http://www.ietf.org/rfc/rfc2396.txt', 
        uri_hierarchical_part : 'http://www.ietf.org/rfc/rfc2396.txt', 
        protocol: 'http',
        slashes: '//',
        authority: undefined,
        host: 'www.ietf.org',
        port: undefined,
        path: '/rfc/rfc2396.txt',
        query: undefined,
        hash: undefined,
        prelude: '',
        postlude: ''
      });
    });
    it( 'for MAILTO', function() {
      test( 'mailto:John.Doe@example.com', {
        uri : 'mailto:John.Doe@example.com', 
        uri_hierarchical_part : 'mailto:John.Doe@example.com', 
        protocol: 'mailto',
        slashes: undefined,
        authority: 'John.Doe',
        host: 'example.com',
        port: undefined,
        path: undefined,
        query: undefined,
        hash: undefined,
        prelude: '',
        postlude: ''
      });
    });
    it( 'for NEWS', function() {
      test( 'news:comp.infosystems.www.servers.unix', {
        uri : 'news:comp.infosystems.www.servers.unix', 
        uri_hierarchical_part : 'news:comp.infosystems.www.servers.unix', 
        protocol: 'news',
        slashes: undefined,
        authority: undefined,
        host: 'comp.infosystems.www.servers.unix',
        port: undefined,
        path: undefined,
        query: undefined,
        hash: undefined,
        prelude: '',
        postlude: ''
      });
    });
    it( 'for TELEPHONE', function() {
      test( 'tel:+1-816-555-1212', {
        uri : 'tel:+1-816-555-1212', 
        uri_hierarchical_part : 'tel:+1-816-555-1212', 
        protocol: 'tel',
        slashes: undefined,
        authority: undefined,
        host: undefined,
        port: undefined,
        path: '+1-816-555-1212',
        query: undefined,
        hash: undefined,
        prelude: '',
        postlude: ''
      });
    });
    it( 'for TELNET', function() {
      test( 'telnet://192.0.2.16:80/', {
        uri : 'telnet://192.0.2.16:80/', 
        uri_hierarchical_part : 'telnet://192.0.2.16:80/', 
        protocol: 'telnet',
        slashes: '//',
        authority: undefined,
        host: '192.0.2.16',
        port: '80',
        path: '/',
        query: undefined,
        hash: undefined,
        prelude: '',
        postlude: ''
      });
    });
  });
  
  describe( 'should match non-fully qualified URIs such as', function() {
    it( 'absolute paths', function() {
      test( '/rfc/rfc1808.txt', {
        uri : '/rfc/rfc1808.txt', 
        uri_hierarchical_part : '/rfc/rfc1808.txt', 
        protocol: undefined,
        slashes: undefined,
        authority: undefined,
        host: undefined,
        port: undefined,
        path: '/rfc/rfc1808.txt',
        query: undefined,
        hash: undefined,
        prelude: '',
        postlude: ''
      });
    });
    it( 'relative paths', function() {
      test( 'some/path/to/somewhere', {
        uri : 'some/path/to/somewhere', 
        uri_hierarchical_part : 'some/path/to/somewhere', 
        protocol: undefined,
        slashes: undefined,
        authority: undefined,
        host: undefined,
        port: undefined,
        path: 'some/path/to/somewhere',
        query: undefined,
        hash: undefined,
        prelude: '',
        postlude: ''
      });
    });
  });
  
  describe( 'should fail', function() {
    it( 'by throwing an exception', function() {
      expect(function() {
        return URI('\u001B');
      }).toThrow();
    });
    it( 'by returning boolean false when option.nothrow is set', function() {
      expect(URI('\u001B', { nothrow: true })).toBe(false);
    });
    it( 'by returning an URI object with error attribute set when option.nothrow is set and invoking `new URI()`', function() {
      expect(new URI('\u001B', { nothrow: true })).toEqual({
        error: 'Invalid URI'
      });
    });
  });
  
});





/**
 ## The Runner and Reporter

 Jasmine is built in JavaScript and must be included into a JS environment, such as a web page, in order to run. Like this web page.

 This file is written in JavaScript and is compiled into HTML via [Rocco][rocco]. The JavaScript file is then included, via a `<script>` tag, so that all of the above specs are evaluated and recorded with Jasmine. Thus Jasmine can run all of these specs. This page is then considered a 'runner.'

 Scroll down the page to see the results of the above specs. All of the specs should pass.

 Meanwhile, here is how a runner works to execute a Jasmine suite.

 [rocco]: http://rtomayko.github.com/rocco/
 */
(function() {
  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 250;

  /**
   Create the `HTMLReporter`, which Jasmine calls to provide results of each spec and each suite. The Reporter is responsible for presenting results to the user.
   */
  var htmlReporter = new jasmine.HtmlReporter();
  jasmineEnv.addReporter(htmlReporter);

  /**
   Delegate filtering of specs to the reporter. Allows for clicking on single suites or specs in the results to only run a subset of the suite.
   */
  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  /**
   Run all of the tests when the page finishes loading - and make sure to run any previous `onload` handler

   ### Test Results

   Scroll down to see the results of all of these specs.
   */
  var currentWindowOnload = window.onload;
  window.onload = function() {
    if (currentWindowOnload) {
      currentWindowOnload();
    }

    //document.querySelector('.version').innerHTML = jasmineEnv.versionString();
    execJasmine();
  };

  function execJasmine() {
    jasmineEnv.execute();
  }
})();

