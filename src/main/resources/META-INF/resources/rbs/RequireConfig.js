/**
 * This file is used when bootstrapping the application to define all the pointers to the vendor files, since the
 * vendor files may be upgraded in version without the client application being aware of the upgrade
 * These upgrades can be transparent if the client application is using the components provided in this module, since
 * those modules should be updated alongside the version upgrades
 */
define([], function () {
  "use strict";

  var DBG = window.debug;
  var dotMin = (!DBG) ? ".min" : "";
  var dashMin = (!DBG) ? "-min" : "";

  var SRI_HASHES = {
    "jquery-cookie": DBG ? "sha384-tSi+YsgNwyohDGfW/VhY51IK3RKAPYDcj1sNXJ16oRAyDP++K0NCzSCUW78EMFmf" : "sha384-ch1nZWLCNJ31V+4aC8U2svT7i40Ru+O8WHeLF4Mvq4aS7VD5ciODxwuOCdkIsX86",
    "underscore": DBG ? "sha384-6sX2meY/CpvrIkapLDMX4YWD1KIOwS4OREKOl43Vkdt5cGwDslb+/6zSTGWmn5oq" : "sha384-FZY+KSLVXVyc1qAlqH9oCx1JEOlQh6iXfw3o2n3Iy32qGjXmUPWT9I0Z9e9wxYe3",
    "modernizr": DBG ? "sha384-90IzDEJE+WgW3iUNa7sk0/Ql8f0eK79/FPcTSMKslc3mlHZ5kAJ6Su2Zlq1uXJr4" : "sha384-bPV3mA2eo3edoq56VzcPBmG1N1QVUfjYMxVIJPPzyFJyFZ8GFfN7Npt06Zr23qts",
    "react": DBG ? "sha384-mVVzCHSaRmxmgRfAZp1LLfGYX7uFd7aw1CKyOevOtqbw5Dd3o0xXTHnF2GhaKMzm" : "sha384-Lo/bWcrFz9YUR2mU5v9OCVk+KOOFl1jhvysqVmsINB5aaIOpbUWYwbvqix42VI9r",
    "react-dom": DBG ? "sha384-G5XJmJOwjFyP0lCdjt5/34MIXhuIKxK4vwp86C2/PYlUD2rC6g07A6jr8xWmOeA1" : "sha384-eWs7cDO+sI5e2ZbzRqP4pidZq+L6qgdwlYwSN+PshbXZkEF9QkxZPTd1gTpLjP8M",
    "original-backbone": DBG ? "sha384-M6j0j9b1fFl/PR3EsPCbWJvTVp+jUtPBPtWRN1iBaQDIqDMQ1cwndDNFQQ+UgCZS" : "sha384-weOHOfYAc0C06zdKsOoCywtQgUIgs1e9goZPDUB6TXW4Eb0bzkY3RDdliYPnu+uB",
    "original-jquery": DBG ? "sha384-1qy6pxCPVEhkjPJM8mBaaRNIDGE20UzrPyndMEoCaeK390vhZ3jt3SQtS6aZDqRA" : "sha384-8gBf6Y4YYq7Jx97PIqmTwLPin4hxIzQw5aDmUg/DDhul9fFpbbLcLh3nTIIDJKhx",
    //"moment": DBG ? "sha384-K8qE7wzpJ8iNH7MT2xq6WvzNQUznUTls0b/JR3rPAyOIzFw0jT717OU3E7hqLrNh" : "sha384-eO4S/LssArKKQkRB5PRQ8u4l72+vGyG1cNXR9l3CJRe5QBOXTInoIazZivoYjDu2",
    "moment-tz": DBG ? "sha384-i6eKl81gE2YAHHqivuJ+ReUNus5ZUry/XQ2Hmt9b+iNhUsSmfxF9rgZeV82ejCTQ" : "sha384-iBng6eos9/W4eG++kxI6WyuRZVXpbLYQPtr4FQ2+C/e5c62PDCAxInnmJUaltZNQ",
    "promise-polyfill": DBG ? "sha384-YEpUBFiWjzvLfbmEeN6MJUSRZx9D8/1hf7TuiRZKj0/1yl+FBSmmpjeqwywPlMjF" : "sha384-ZgETm4wKUprkfVQHulnmY9bMX9AODgCud7kPePE+trsl6WlZHtCL2wIPPjHOU2Zh"
  };

  return {
    baseUrl: "",

    paths: {
      "backbone": "rbs/etc/library-extensions/Backbone",
      "util": "rbs/etc/Util",
      "jquery": "rbs/etc/library-extensions/jQueryExtras",
      "jsog": "rbs/vendor/jsog/JSOG",
      "raf": "rbs/vendor/polyfill/rAF",
      "fb": "//connect.facebook.net/en_US/sdk",
      "ga": "//www.google-analytics.com/analytics",
      "jquery-cookie": "//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie" + dotMin,
      "underscore": "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore" + dashMin,
      "modernizr": "//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr" + dotMin,
      "react": "//cdnjs.cloudflare.com/ajax/libs/react/0.14.1/react-with-addons" + dotMin,
      "react-dom": "//cdnjs.cloudflare.com/ajax/libs/react/0.14.1/react-dom" + dotMin,
      "original-backbone": "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.1/backbone" + dashMin,
      "original-jquery": "//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery" + dotMin,
      "moment": "//cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.3/moment-with-locales" + dotMin,
      "moment-tz": "//cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.4.0/moment-timezone-with-data" + dotMin,
      "promise-polyfill": "//cdnjs.cloudflare.com/ajax/libs/es6-promise/3.0.2/es6-promise" + dotMin
    },

    shim: {
      "fb": {
        exports: "FB"
      },
      "jsog": {
        exports: "JSOG"
      },
      "original-jquery": {
        exports: "$"
      },
      "original-backbone": {
        deps: [ "jquery", "underscore" ]
      },
      "underscore": {
        exports: "_"
      },
      "ga": {
        exports: "ga"
      },
      "jquery-cookie": {
        deps: [ "jquery" ],
        exports: "$"
      },
      "moment-tz": {
        deps: [ "moment" ]
      },
      "modernizr": {
        exports: "Modernizr"
      }
    },

    // set the SRI integrity hash
    onNodeCreated: function (node, config, moduleName, url) {
      if (typeof SRI_HASHES[ moduleName ] === "string") {
        node.integrity = SRI_HASHES[ moduleName ];
        node.crossOrigin = "anonymous";
      }
    }
  };
});
