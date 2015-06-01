define({
    baseUrl: "",

    paths: {
        "backbone": "rbs/etc/library-extensions/Backbone",
        "original-backbone": "webjars/backbonejs/1.1.2/backbone-min",
        "jquery": "rbs/etc/library-extensions/jQueryExtensions",
        "original-jquery": "webjars/jquery/1.11.2/jquery.min",
        "bootstrap": "webjars/bootstrap/3.3.2-1/js/bootstrap.min",
        "underscore": "webjars/underscorejs/1.6.0/underscore-min",
        "underscore-extras": "rbs/etc/library-extensions/UnderscoreExtras",
        "text": "webjars/requirejs-text/2.0.10-3/text",
        "facebook": "//connect.facebook.net/en_US/sdk",
        "jsog": "rbs/vendor/jsog/JSOG",
        "raf": "rbs/vendor/polyfill/rAF",
        "ga": "//www.google-analytics.com/analytics"
    },

    shim: {
        "facebook": {
            exports: "FB"
        },
        "deep-model": {
            deps: ["original-backbone"]
        },
        "jsog": {
            exports: "JSOG"
        },
        "original-backbone": {
            deps: ["jquery", "underscore"]
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