define(["./InputView", "underscore"], function (inputView, _) {
    "use strict";

    return inputView.extend({
        type: "checkbox",

        render: function () {
            this.$el.prop("checked", Boolean(this.model.get(this.attribute)));
            return this;
        }
    });
});