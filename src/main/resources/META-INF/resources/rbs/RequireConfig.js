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
  return {
    baseUrl: "",

    paths: {
      "backbone": "rbs/etc/library-extensions/Backbone",
      "underscore": "rbs/etc/library-extensions/UnderscoreExtras",
      "jsog": "rbs/vendor/jsog/JSOG",
      "raf": "rbs/vendor/polyfill/rAF",
      "fb": "//connect.facebook.net/en_US/sdk",
      "ga": "//www.google-analytics.com/analytics",
      "jquery-cookie": "//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie" + dotMin,
      "original-underscore": "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore" + dashMin,
      "react": "//cdnjs.cloudflare.com/ajax/libs/react/0.13.3/react-with-addons" + dotMin,
      "original-backbone": "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.1/backbone" + dashMin,
      "jquery": "//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery" + dotMin,
      "moment": "//cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.3/moment-with-locales" + dotMin,
      "moment-tz": "//cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.4.0/moment-timezone-with-data" + dotMin
    },

    shim: {
      "fb": {
        exports: "FB"
      },
      "jsog": {
        exports: "JSOG"
      },
      "original-backbone": {
        deps: [ "jquery", "original-underscore" ]
      },
      "original-underscore": {
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
      }
    }
  };
});