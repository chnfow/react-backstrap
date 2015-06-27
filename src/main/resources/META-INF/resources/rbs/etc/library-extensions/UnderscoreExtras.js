define(["original-underscore", "react"], function (_, React) {
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
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
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
      var toAdd = arguments[i];
      if (typeof toAdd === "number") {
        toAdd = toAdd.toString();
      }
      if (typeof toAdd !== "string" || toAdd.length === 0) {
        console.error("invalid or empty argument passed to _.path", arguments[i]);
      }
      if (toReturn.length === 0) {
        toReturn = toAdd;
        continue;
      }
      var lastChar = toReturn[toReturn.length - 1];
      var firstChar = toAdd[0];
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
    var origArray = arguments[0];
    if (!_.isArray(origArray)) {
      if (origArray !== null && typeof origArray !== "undefined") {
        origArray = [origArray];
      } else {
        origArray = [];
      }
    }
    for (var i = 1; i < arguments.length; i++) {
      var toAdd = arguments[i];
      if (_.isArray(toAdd)) {
        origArray = origArray.concat(toAdd);
      } else {
        if (toAdd !== null && typeof toAdd !== "undefined") {
          origArray = _.union(origArray, [toAdd]);
        }
      }
    }
    return origArray;
  };

  util.debug = function () {
    if (window.debug === true) {
      window.console.log.apply(window.console, arguments);
    }
    if (typeof window.debug === "function") {
      window.debug.apply(window, arguments);
    }
  };

  util.rf = _.compose(React.createFactory, React.createClass);

  _.mixin(util);
  return _;
});