define(["underscore"], function (_) {
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

    // this function creates a span that displays the icon
    var iconTemplate = _.template(' <span class="glyphicon glyphicon-<%- icon %>"></span> ');
    util.icon = function (iconName) {
        return iconTemplate({ icon: iconName });
    };

    util.canRender = function (view) {
        return (view && typeof view.render === "function");
    };

    util.canRemove = function (view) {
        return (view && typeof view.remove === "function");
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

    _.mixin(util);
    return _;
});