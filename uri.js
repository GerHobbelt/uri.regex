/*
 * URI(input, options)
 *
 * Return an URI object containing the parsed elements of the uri string passed as `input`.
 *
 * If the passed string is not a legal uri, then either an exception is thrown or
 * the boolean value FALSE is returned, depending on whether you specified the
 * `nothrow` option.
 */

(function ( window, factory ) {

    if ( typeof module === "object" && typeof module.exports === "object" ) {
        // Expose a factory as module.exports in loaders that implement the Node
        // module pattern (including browserify).
        // This accentuates the need for a real window in the environment
        // e.g. var jQuery = require("jquery")(window);
        module.exports = function(w) {
            w = w || window;
            return factory(w);
        };
    } else {
        if ( typeof define === "function" && define.amd ) {
            // AMD. Register as a named module.
            define( "uri", [], function() {
                return factory(window);
            });
        } else {
            // Browser globals
            window.URI = factory(window);
        }
    }

// Pass this, window may not be defined yet
}(this, function (window, undefined) {

    'use strict';

    function URI(input, options) {
      options = options || {};
      
      if (!(this instanceof URI)) {
        var rv = new URI(input, options);
        if (rv.error && options.nothrow) {
          return false;
        }
        return rv;
      }

      var match = ('' + input).match(URI.pattern);
      if (!match) { 
        if (options.nothrow) {
          this.error = 'Invalid URI';
          return this;
        } else {
          throw new SyntaxError('Invalid URI');
        }
      }
      
      this.uri       = match[0];
      this.uri_hierarchical_part = match[1];
      this.protocol  = match[2];
      this.slashes   = match[3]                         || match[10];
      this.authority = match[4]                         || match[11];
      this.host      = match[5]                         || match[12];
      this.port      = match[6]                         || match[13];
      this.path      = match[7] || match[8] || match[9] || match[14] || match[15] || match[16] || match[17] || match[18] || match[19] || match[20];
      this.query     = match[21];
      this.hash      = match[22];
    }

    //---regex---
    //
    // # RFC-3986 URI component: URI-reference
    // # from: http://jmrware.com/articles/2009/uri_regexp/URI_regex.html
    // #
    // # modifications:
    // #  - added capture groups
    // #  - added absolute and relative paths as means to specify a (relative, same host only) URI
    // #
    // (                                                                   # absolute-ref URI             #1 - entire URI except query and fragment
    //   ([A-Za-z][A-Za-z0-9+\-.]*) :                                      # scheme ":"                   #2 - scheme
    //   (?: (//)                                                          # hier-part                    #3 - slashes
    //     (?: ((?:[A-Za-z0-9\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*) @)?     # authority   (userinfo "@")   #4 - userinfo
    //     ((?:                                                            # host                         #5 - host
    //       \[                                                            #   IP literal
    //       (?:
    //         (?:                                                         #     IPv6 address
    //           (?:                                                    (?:[0-9A-Fa-f]{1,4}:){6}
    //           |                                                   :: (?:[0-9A-Fa-f]{1,4}:){5}
    //           | (?:                            [0-9A-Fa-f]{1,4})? :: (?:[0-9A-Fa-f]{1,4}:){4}
    //           | (?: (?:[0-9A-Fa-f]{1,4}:){0,1} [0-9A-Fa-f]{1,4})? :: (?:[0-9A-Fa-f]{1,4}:){3}
    //           | (?: (?:[0-9A-Fa-f]{1,4}:){0,2} [0-9A-Fa-f]{1,4})? :: (?:[0-9A-Fa-f]{1,4}:){2}
    //           | (?: (?:[0-9A-Fa-f]{1,4}:){0,3} [0-9A-Fa-f]{1,4})? ::    [0-9A-Fa-f]{1,4}:
    //           | (?: (?:[0-9A-Fa-f]{1,4}:){0,4} [0-9A-Fa-f]{1,4})? ::
    //           ) (?:
    //               [0-9A-Fa-f]{1,4} : [0-9A-Fa-f]{1,4}
    //             | (?: (?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?) \.){3}
    //                   (?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)
    //             )
    //         |   (?: (?:[0-9A-Fa-f]{1,4}:){0,5} [0-9A-Fa-f]{1,4})? ::    [0-9A-Fa-f]{1,4}
    //         |   (?: (?:[0-9A-Fa-f]{1,4}:){0,6} [0-9A-Fa-f]{1,4})? ::
    //         )
    //       | [Vv][0-9A-Fa-f]+\.[A-Za-z0-9\-._~!$&'()*+,;=:]+             #     IPvFuture
    //       )
    //       \]
    //     | (?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}             #   IPv4 address
    //          (?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)
    //     | (?:[A-Za-z0-9\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*              #   reg-name
    //     ))
    //     (?: : ([0-9]*) )?                                               #   [ ":" port ]               #6 - port
    //     ((?:/ (?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})* )*)    # path-abempty                 #7 - path
    //   | ( /                                                             # path-absolute                #8 - path
    //       (?:    (?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+
    //         (?:/ (?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})* )*
    //     )?)
    //   | (        (?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+     # path-rootless                #9 - path
    //       (?:/ (?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})* )*)
    //   |                                                                 # path-empty                   #- - empty path
    //   )
    // |                                                                   # relative-ref URI
    //   (?: (//)                                                          # hier-part                    #10 - slashes
    //     (?: ((?:[A-Za-z0-9\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*) @)?     # authority   (userinfo "@")   #11 - userinfo
    //     ((?:                                                            # host                         #12 - host
    //       \[                                                            #   IP literal
    //       (?:
    //         (?:                                                         #     IPv6 address
    //           (?:                                                    (?:[0-9A-Fa-f]{1,4}:){6}
    //           |                                                   :: (?:[0-9A-Fa-f]{1,4}:){5}
    //           | (?:                            [0-9A-Fa-f]{1,4})? :: (?:[0-9A-Fa-f]{1,4}:){4}
    //           | (?: (?:[0-9A-Fa-f]{1,4}:){0,1} [0-9A-Fa-f]{1,4})? :: (?:[0-9A-Fa-f]{1,4}:){3}
    //           | (?: (?:[0-9A-Fa-f]{1,4}:){0,2} [0-9A-Fa-f]{1,4})? :: (?:[0-9A-Fa-f]{1,4}:){2}
    //           | (?: (?:[0-9A-Fa-f]{1,4}:){0,3} [0-9A-Fa-f]{1,4})? ::    [0-9A-Fa-f]{1,4}:
    //           | (?: (?:[0-9A-Fa-f]{1,4}:){0,4} [0-9A-Fa-f]{1,4})? ::
    //           ) (?:
    //               [0-9A-Fa-f]{1,4} : [0-9A-Fa-f]{1,4}
    //             | (?: (?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?) \.){3}
    //                   (?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)
    //             )
    //         |   (?: (?:[0-9A-Fa-f]{1,4}:){0,5} [0-9A-Fa-f]{1,4})? ::    [0-9A-Fa-f]{1,4}
    //         |   (?: (?:[0-9A-Fa-f]{1,4}:){0,6} [0-9A-Fa-f]{1,4})? ::
    //         )
    //       | [Vv][0-9A-Fa-f]+\.[A-Za-z0-9\-._~!$&'()*+,;=:]+             #     IPvFuture
    //       )
    //       \]
    //     | (?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}             #   IPv4 address
    //          (?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)
    //     | (?:[A-Za-z0-9\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*              #   reg-name
    //     ))
    //     (?: : ([0-9]*) )?                                               #   [ ":" port ]               #13 - port
    //     ((?:/ (?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})* )*)    # path-abempty                 #14 - path
    //   | ( /                                                             # path-absolute                #15 - path
    //       (?:    (?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+
    //         (?:/ (?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})* )*
    //     )?)
    //   | (        (?:[A-Za-z0-9\-._~!$&'()*+,;=@] |%[0-9A-Fa-f]{2})+     # path-noscheme                #16 - path
    //       (?:/ (?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})* )*)
    //   |                                                                 # path-empty                   #- - empty path
    //   )
    // |                                                                   # path (local URI reference):
    //                                                                     #   path-abempty    ; begins with "/" or is empty
    //                                                                     # / path-absolute   ; begins with "/" but not "//"
    //                                                                     # / path-noscheme   ; begins with a non-colon segment
    //                                                                     # / path-rootless   ; begins with a segment
    //                                                                     # / path-empty      ; zero characters
    //                                                                     #
    //                                                                     # RFC-3986 URI component: path
    //   ((?:/ (?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})* )*)      # path-abempty                 #17 - path
    // | ( /                                                               # path-absolute                #18 - path
    //     (?:    (?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+
    //       (?:/ (?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})* )*
    //   )?)
    // | (        (?:[A-Za-z0-9\-._~!$&'()*+,;=@] |%[0-9A-Fa-f]{2})+       # path-noscheme                #19 - path
    //     (?:/ (?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})* )*)
    // | (        (?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+       # path-rootless                #20 - path
    //     (?:/ (?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})* )*)
    // |                                                                   # path-empty                   #- - empty path
    // )
    // (?:\? ((?:[A-Za-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9A-Fa-f]{2})*) )?     # [ "?" query ]                #21 - query
    // (?:\# ((?:[A-Za-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9A-Fa-f]{2})*) )?     # [ "#" fragment ]             #22 - fragment
    // 
    //
    URI.pattern = new RegExp("([A-Za-z][A-Za-z0-9+\\-.]*):(?:(//)(?:((?:[A-Za-z0-9\\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*)@)?((?:\\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\\.[A-Za-z0-9\\-._~!$&'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*))(?::([0-9]*))?((?:/(?:[A-Za-z0-9\\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)|(/(?:(?:[A-Za-z0-9\\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:/(?:[A-Za-z0-9\\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?)|((?:[A-Za-z0-9\\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:/(?:[A-Za-z0-9\\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)|)|(?:(//)(?:((?:[A-Za-z0-9\\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*)@)?((?:\\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\\.[A-Za-z0-9\\-._~!$&'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*))(?::([0-9]*))?((?:/(?:[A-Za-z0-9\\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)|(/(?:(?:[A-Za-z0-9\\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:/(?:[A-Za-z0-9\\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?)|((?:[A-Za-z0-9\\-._~!$&'()*+,;=@]|%[0-9A-Fa-f]{2})+(?:/(?:[A-Za-z0-9\\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)|)|((?:/(?:[A-Za-z0-9\\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)|(/(?:(?:[A-Za-z0-9\\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:/(?:[A-Za-z0-9\\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?)|((?:[A-Za-z0-9\\-._~!$&'()*+,;=@]|%[0-9A-Fa-f]{2})+(?:/(?:[A-Za-z0-9\\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)|((?:[A-Za-z0-9\\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:/(?:[A-Za-z0-9\\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)|)(?:\\?((?:[A-Za-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9A-Fa-f]{2})*))?(?:\\#((?:[A-Za-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9A-Fa-f]{2})*))?");
    //---/regex---

    return URI;

}));

