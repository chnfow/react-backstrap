define(["./ModelView", "underscore"], function (modelView, _) {
    "use strict";
    return modelView.extend({
        tagName: "option",

        options: _.union(modelView.prototype.options, ["valueAttribute"]),
        valueAttribute: "id",

        attributes: function () {
            return {
                name: this.attribute,
                value: this.model.get(this.valueAttribute)
            };
        },

        modelAttributes: [
            {
                attribute: "name",
                view: "span"
            }
        ]
    });
});