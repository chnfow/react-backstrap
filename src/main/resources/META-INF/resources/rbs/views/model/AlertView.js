define(["./ModelView", "underscore"], function (modelView, _) {
    "use strict";
    return modelView.extend({
        tagName: "div",

        options: _.union(modelView.prototype.options),

        className: function () {
            var classes = ["alert"];
            if (this.model.has("type")) {
                classes.push("alert-" + this.model.get("type"));
            } else {
                classes.push("alert-info");
            }
            return classes.join(" ");
        },

        attributes: {
            role: "alert"
        },

        modelAttributes: [
            {
                attribute: "icon",
                view: "icon"
            },
            {
                attribute: "strong",
                view: "span",
                tagName: "strong"
            },
            {
                attribute: "message",
                view: "span"
            }
        ]
    });
});