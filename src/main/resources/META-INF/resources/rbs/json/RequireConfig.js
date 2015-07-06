/**
 * This file is used when bootstrapping the application to define all the pointers to the vendor files, since the
 * vendor files may be upgraded in version without the client application being aware of the upgrade
 * These upgrades can be transparent if the client application is using the components provided in this module, since
 * those modules should be updated alongside the version upgrades
 */
define([], function () {
  "use strict";

  var DBG = window.debug;
  var condDotMin = (!DBG) ? ".min" : "";
  var condDashMin = (!DBG) ? "-min" : "";
  return {
    baseUrl: "",

    paths: {
      "backbone": "rbs/etc/library-extensions/Backbone",
      "original-backbone": "webjars/backbonejs/1.2.1/backbone" + condDashMin,
      "jquery": "rbs/etc/library-extensions/jQueryExtensions",
      "original-jquery": "webjars/jquery/1.11.3/jquery" + condDotMin,
      "jquery-cookie": "webjars/jquery-cookie/1.4.1-1/jquery.cookie",
      "underscore": "rbs/etc/library-extensions/UnderscoreExtras",
      "original-underscore": "webjars/underscorejs/1.8.3/underscore" + condDashMin,
      "fb": "//connect.facebook.net/en_US/sdk",
      "jsog": "rbs/vendor/jsog/JSOG",
      "react": "webjars/react/0.13.3/react-with-addons" + condDotMin,
      "raf": "rbs/vendor/polyfill/rAF",
      "moment": "webjars/momentjs/2.10.3/min/moment-with-locales" + condDotMin,
      "ga": "//www.google-analytics.com/analytics"
    },

    shim: {
      "fb": {
        exports: "FB"
      },
      "jsog": {
        exports: "JSOG"
      },
      "original-backbone": {
        deps: ["jquery", "original-underscore"]
      },
      "original-underscore": {
        exports: "_"
      },
      "bootstrap": {
        deps: ["jquery"]
      },
      "ga": {
        exports: "ga"
      },
      "original-jquery": {
        exports: "$"
      },
      "jquery-cookie": {
        deps: ["original-jquery"],
        exports: "$"
      }
    }
  };
});