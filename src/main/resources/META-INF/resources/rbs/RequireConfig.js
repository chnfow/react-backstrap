/**
 * This configuration has all the dependencies defined that RBS uses.
 */
define([], function () {
  "use strict";

  var DBG = window.debug;
  var dotMin = (!DBG) ? ".min" : "";
  var dashMin = (!DBG) ? "-min" : "";

  var SRI_HASHES = {
    //jquery cookies
    "https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js": "sha384-ch1nZWLCNJ31V+4aC8U2svT7i40Ru+O8WHeLF4Mvq4aS7VD5ciODxwuOCdkIsX86",
    "https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js": "sha384-tSi+YsgNwyohDGfW/VhY51IK3RKAPYDcj1sNXJ16oRAyDP++K0NCzSCUW78EMFmf",
    // underscore min
    "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js": "sha384-FZY+KSLVXVyc1qAlqH9oCx1JEOlQh6iXfw3o2n3Iy32qGjXmUPWT9I0Z9e9wxYe3",
    "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js": "sha384-6sX2meY/CpvrIkapLDMX4YWD1KIOwS4OREKOl43Vkdt5cGwDslb+/6zSTGWmn5oq",
    // modernizr
    "https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js": "sha384-bPV3mA2eo3edoq56VzcPBmG1N1QVUfjYMxVIJPPzyFJyFZ8GFfN7Npt06Zr23qts",
    "https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.js": "sha384-90IzDEJE+WgW3iUNa7sk0/Ql8f0eK79/FPcTSMKslc3mlHZ5kAJ6Su2Zlq1uXJr4",
    // react
    "https://cdnjs.cloudflare.com/ajax/libs/react/0.14.2/react-with-addons.min.js": "sha384-5Zh2qJblrDO8t4hGbVPn7dZiEgrURElRTd1Cgt24PfxIQ4U42Tjg+DQlOatLEFLU",
    "https://cdnjs.cloudflare.com/ajax/libs/react/0.14.2/react-with-addons.js": "sha384-2zI7qqMuyM3gyk1P3oIqg+QJdcyZd730pDyFKc71a21JIY2YNgmQm1MYdCHFfpQr",
    // react-dom
    "https://cdnjs.cloudflare.com/ajax/libs/react/0.14.2/react-dom.min.js": "sha384-7u8wWhoxHbsZFDKjRYoJExhsmWnQVzW1e6czkBuFjzMh5DaFFAPbEQDb9iOYWwEc",
    "https://cdnjs.cloudflare.com/ajax/libs/react/0.14.2/react-dom.js": "sha384-HDILvK6cNR7D3zEDVYogct6Zx87DIrWVZXU2zsQEYtHbH8ns7ELaxMxnVWC77RDh",
    //backbone
    "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.3/backbone-min.js": "sha384-kgH1F06klaG52/uQEQlpP5QZ9tbJZgcU4omvs1DRSHaJGVZWp//NYtoi93ZmGday",
    "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.3/backbone.js": "sha384-r9PJlmRHSFQ7gGJVTI8m1xYtzr/xlV/QCBHDhzU3nDFDmEfhRsaRWWJsjHGzoXgQ",
    // jquery
    "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js": "sha384-8gBf6Y4YYq7Jx97PIqmTwLPin4hxIzQw5aDmUg/DDhul9fFpbbLcLh3nTIIDJKhx",
    "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.js": "sha384-1qy6pxCPVEhkjPJM8mBaaRNIDGE20UzrPyndMEoCaeK390vhZ3jt3SQtS6aZDqRA",
    // moment-tz
    "https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.4.0/moment-timezone-with-data.min.js": "sha384-iBng6eos9/W4eG++kxI6WyuRZVXpbLYQPtr4FQ2+C/e5c62PDCAxInnmJUaltZNQ",
    "https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.4.0/moment-timezone-with-data.js": "sha384-i6eKl81gE2YAHHqivuJ+ReUNus5ZUry/XQ2Hmt9b+iNhUsSmfxF9rgZeV82ejCTQ",
    // promise polyfill
    "https://cdnjs.cloudflare.com/ajax/libs/es6-promise/3.0.2/es6-promise.min.js": "sha384-ZgETm4wKUprkfVQHulnmY9bMX9AODgCud7kPePE+trsl6WlZHtCL2wIPPjHOU2Zh",
    "https://cdnjs.cloudflare.com/ajax/libs/es6-promise/3.0.2/es6-promise.js": "sha384-YEpUBFiWjzvLfbmEeN6MJUSRZx9D8/1hf7TuiRZKj0/1yl+FBSmmpjeqwywPlMjF"
  };

  return {
    baseUrl: "",

    paths: {
      "backbone": "rbs/etc/library-extensions/Backbone",
      "util": "rbs/etc/Util",
      "jquery": "rbs/etc/library-extensions/jQueryExtras",
      "jsog": "rbs/vendor/jsog/JSOG",
      "raf": "rbs/vendor/polyfill/RequestAnimationFrame",
      "fb": "https://connect.facebook.net/en_US/sdk",
      "ga": "https://www.google-analytics.com/analytics",
      "jquery-cookie": "https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie" + dotMin,
      "underscore": "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore" + dashMin,
      "modernizr": "https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr" + dotMin,
      "react": "https://cdnjs.cloudflare.com/ajax/libs/react/0.14.2/react-with-addons" + dotMin,
      "react-dom": "https://cdnjs.cloudflare.com/ajax/libs/react/0.14.2/react-dom" + dotMin,
      "original-backbone": "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.3/backbone" + dashMin,
      "original-jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery" + dotMin,
      "moment": "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.3/moment-with-locales" + dotMin,
      "moment-tz": "https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.4.0/moment-timezone-with-data" + dotMin,
      "promise-polyfill": "https://cdnjs.cloudflare.com/ajax/libs/es6-promise/3.0.2/es6-promise" + dotMin
    },

    shim: {
      "fb": {
        exports: "FB"
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
      if (typeof SRI_HASHES[ url ] === "string") {
        node.integrity = SRI_HASHES[ url ];
        node.crossOrigin = "anonymous";
      }
    }
  };
});
