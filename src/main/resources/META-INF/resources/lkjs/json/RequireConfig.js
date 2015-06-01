define({
    baseUrl: "",

    paths: {
        "backbone": "lkjs/etc/library-extensions/Backbone",
        "original-backbone": "webjars/backbonejs/1.1.2/backbone-min",
        "jquery": "webjars/jquery/1.11.2/jquery.min",
        "jquery-extensions": "lkjs/etc/library-extensions/jQueryExtensions",
        "bootstrap": "webjars/bootstrap/3.3.2-1/js/bootstrap.min",
        "underscore": "webjars/underscorejs/1.6.0/underscore-min",
        "underscore-extras": "lkjs/etc/library-extensions/UnderscoreExtras",
        "text": "webjars/requirejs-text/2.0.10-3/text",
        "facebook": "//connect.facebook.net/en_US/sdk",
        "jsog": "lkjs/vendor/jsog/JSOG",
        "raf": "lkjs/vendor/polyfill/rAF",
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
        }
    }
});