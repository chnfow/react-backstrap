define([ "underscore", "react" ], function (_, React) {
  "use strict";
  var util = {};

  /**
   * Replace profanity in a string with asterisks
   */
  var profanity = /\b(ass|asshole|shit|fuck|fucking|cunt|damn|prick|dick|clit|cock)+\b/gi;
  var repeatCharacter = function (character, count) {
    var toReturn = "";
    while (count > 0) {
      count--;
      toReturn += character;
    }
    return toReturn;
  };
  util.clean = function (string) {
    if (typeof string !== "string") {
      return string;
    }
    return string.replace(profanity, function (curse) {
      return repeatCharacter("*", curse.length);
    });
  };

  util.capitalize = function (string) {
    if (typeof string !== "string") {
      console.error("Value passed to capitalize is not a string", string);
      return string;
    }
    if (string.length <= 0) {
      return string;
    }
    return string[ 0 ].toUpperCase() + string.slice(1).toLowerCase();
  };

  util.randomString = function (length, characters) {
    length = length || 10;
    characters = characters || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var toReturn = "";
    for (var i = 0; i < length; i++) {
      toReturn += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return toReturn;
  };

  /**
   * Used to concatenate a list of arguments into a path that may or may not end/start with "/"
   */
  util.path = function () {
    var toReturn = "";
    for (var i = 0, j = arguments.length; i < j; i++) {
      var toAdd = arguments[ i ];
      if (typeof toAdd === "number") {
        toAdd = toAdd.toString();
      }
      if (typeof toAdd !== "string" || toAdd.length === 0) {
        console.error("invalid or empty argument passed to Util.path", arguments[ i ]);
        continue;
      }
      if (toReturn.length === 0) {
        toReturn = toAdd;
        continue;
      }
      var lastChar = toReturn[ toReturn.length - 1 ];
      var firstChar = toAdd[ 0 ];
      if (lastChar === "/") {
        if (firstChar === "/") {
          toReturn += toAdd.slice(1);
        } else {
          toReturn += toAdd;
        }
      } else {
        if (firstChar === "/") {
          toReturn += toAdd;
        } else {
          toReturn += "/" + toAdd;
        }
      }
    }
    return toReturn;
  };

  /**
   * Takes a string, splits it, removes the empty pieces, and joins the result
   */
  util.removeEmptyValues = function (string, splitter) {
    var pieces = string.split(splitter);
    var toReturn = [];
    _.each(pieces, function (onePiece) {
      if (onePiece && onePiece.length) {
        toReturn.push(onePiece);
      }
    });
    return toReturn.join(splitter);
  };

  util.addToArray = function () {
    var origArray = arguments[ 0 ];
    if (!_.isArray(origArray)) {
      if (origArray !== null && typeof origArray !== "undefined") {
        origArray = [ origArray ];
      } else {
        origArray = [];
      }
    }
    for (var i = 1; i < arguments.length; i++) {
      var toAdd = arguments[ i ];
      if (_.isArray(toAdd)) {
        origArray = origArray.concat(toAdd);
      } else {
        if (toAdd !== null && typeof toAdd !== "undefined") {
          origArray = _.union(origArray, [ toAdd ]);
        }
      }
    }
    return origArray;
  };

  util.debug = function () {
    if (window.debug === true) {
      window.console.debug.apply(window.console, arguments);
    }
    if (typeof window.debug === "function") {
      window.debug.apply(window, arguments);
    }
  };

  // returns the internal path of a link if it's internal to the site, otherwise false
  util.internalLink = function (link) {
    if (typeof link !== "string") {
      return false;
    }
    if (link.indexOf("//") !== -1) {
      return false;
    }
    if (link.toLowerCase().indexOf("mailto:") === 0) {
      return false;
    }
    return link;
  };

  util.supportInput = function (type) {
    var i = document.createElement("input");
    i.setAttribute("type", type);
    return i.type !== "text";
  };

  util.numDays = function (month, year) {
    var monthStart = new Date(year, month, 1);
    var monthEnd = new Date(year, month + 1, 1);
    return Math.round((monthEnd - monthStart) / (1000 * 60 * 60 * 24));
  };

  util.parseQueryString = function (queryString) {
    if (typeof queryString !== "string") {
      return {};
    }
    var toReturn = {};

    // read the query string
    queryString = decodeURIComponent(queryString);
    var pieces = queryString.split("&");
    _.each(pieces, function (onePiece) {
      var equationPieces = onePiece.split("=");
      if (equationPieces.length !== 2) {
        return;
      }
      var attribute = equationPieces[ 0 ];
      var value = equationPieces[ 1 ];
      // invalid attribute name
      if (attribute.length === 0) {
        return;
      }
      var isArray = (attribute.substr(attribute.length - 2, 2) === "[]");
      if (value.length === 0) {
        toReturn[ attribute ] = null;
        return;
      }
      if (!isNaN(+value)) {
        value = +value;
      }
      if (typeof value === "string") {
        if (value.toLowerCase() === "false") {
          value = false;
        }
      }
      if (typeof value === "string") {
        if (value.toLowerCase() === "true") {
          value = true;
        }
      }
      if (isArray) {
        attribute = attribute.substr(0, attribute.length - 2);
        toReturn[ attribute ] = (toReturn[ attribute ] || []).concat([ value ]);
      } else {
        toReturn[ attribute ] = value;
      }
    });

    return toReturn;
  };

  util.loadImage = function (src, callback) {
    var img = new Image();
    img.onload = callback;
    img.src = src;
  };

  util.rf = _.compose(React.createFactory, React.createClass);

  util.concatWS = function concatWS(separator) {
    if (typeof separator !== "string") {
      util.debug("Invalid separator passed to Util.concatWS");
      return null;
    }
    var validValues = [];
    for (var i = 1; i < arguments.length; i++) {
      if (typeof arguments[ i ] === "string" && arguments[ i ].length > 0) {
        validValues.push(arguments[ i ]);
      } else {
        util.debug("Invalid or empty value passed to Util.concatWS will be skipped", arguments[ i ]);
      }
    }
    return validValues.join(separator);
  };

  return _;
});
