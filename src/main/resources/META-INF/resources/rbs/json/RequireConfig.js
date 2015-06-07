/**
 * This file is used when bootstrapping the application to define all the pointers to the vendor files, since the
 * vendor files may be upgraded in version without the client application being aware of the upgrade
 * These upgrades can be transparent if the client application is using the components provided in this module, since
 * those modules should be updated alongside the version upgrades
 */
define({
  baseUrl: "",

  paths: {
    "backbone": "rbs/etc/library-extensions/Backbone",
    "original-backbone": "webjars/backbonejs/1.1.2/backbone-min",
    "jquery": "rbs/etc/library-extensions/jQueryExtensions",
    "original-jquery": "webjars/jquery/1.11.3/jquery.min",
    "underscore": "rbs/etc/library-extensions/UnderscoreExtras",
    "original-underscore": "webjars/underscorejs/1.8.3/underscore-min",
    "fb": "//connect.facebook.net/en_US/sdk",
    "jsog": "rbs/vendor/jsog/JSOG",
    "react": "webjars/react/0.13.3/react-with-addons.min",//.min",
    "raf": "rbs/vendor/polyfill/rAF",
    "ga": "//www.google-analytics.com/analytics"
  },

  shim: {
    "fb": {
      exports: "fb"
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
    }
  }
});