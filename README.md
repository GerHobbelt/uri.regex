# URI Regular Expression [![Build Status](https://travis-ci.org/jhermsmeier/uri.regex.png?branch=master)](https://travis-ci.org/jhermsmeier/uri.regex)

I found a perfectly working regular expression on [jmrware.com](http://jmrware.com/articles/2009/uri_regexp/URI_regex.html),
stole it and added capture groups for the various parts. All credit for that regex goes to Jeff Roberson.

### Example Usage of uri.js

```javascript
var URI = require('./uri.js');
var input = 'http://user:password@example.com:8080/some/path/to/somewhere?search=regex&order=desc#fragment';

var uri = URI(input); // =>
{
  protocol:  'http',                      // match[1]
  slashes:   '//',                        // match[2]
  authority: 'user:password',             // match[3]
  host:      'example.com',               // match[4]
  port:      '8080',                      // match[5]
  path:      '/some/path/to/somewhere',   // match[6] || match[7] || match[8]
  query:     'search=regex&order=desc',   // match[9]
  hash:      'fragment'                   // match[10]
}
```

### API

    function URI(input, options)

Return an URI object containing the parsed elements of the uri string passed as `input`.

If the passed string is not a legal uri, then either an exception is thrown or
the boolean value FALSE is returned, depending on whether you specified the
`nothrow` option.

*Notes*: the function can be invoked as is or as a constructor; in both scenarios
`URI()` will ensure a URI instance (object) containing the decoded URI components
is returned:

- protocol
- slashes
- authority
- host
- port
- path
- query
- hash

