({
  // the directory with the source files
  appDir: "${basedir}/src/main/resources/META-INF/resources",
  // where the built files go
  dir: "${project.build.directory}/classes/META-INF/resources",
  // the assumed base URL for the require
  baseUrl: ".",

  // the optimizer engine
  optimize: "uglify2",
  preserveLicenseComments: false,
  generateSourceMaps: true,

  paths: {
    "backbone": "rbs/etc/library-extensions/Backbone",
    "util": "rbs/etc/Util",
    "jquery": "rbs/etc/library-extensions/jQueryExtras",
    "jsog": "rbs/vendor/jsog/JSOG.min",
    "raf": "rbs/vendor/polyfill/rAF",
    "fb": "empty:",
    "ga": "empty:",
    "jquery-cookie": "empty:",
    "underscore": "empty:",
    "modernizr": "empty:",
    "react": "empty:",
    "react-dom": "empty:",
    "original-backbone": "empty:",
    "original-jquery": "empty:",
    "moment": "empty:",
    "moment-tz": "empty:",
    "promise-polyfill": "empty:"
  },

  modules: [
    {
      name: "rbs"
    }
  ]
})