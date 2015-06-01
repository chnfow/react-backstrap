define(["./ModelView", "underscore-extras"], function (modelView, _) {
    "use strict";

    return modelView.extend({
        options: _.union(modelView.prototype.options),
        tagName: "li"
    });
});