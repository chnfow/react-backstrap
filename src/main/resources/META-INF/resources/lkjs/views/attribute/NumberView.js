define(["./InputView", "underscore"], function (inputView, _) {
    "use strict";

    return inputView.extend({
        type: "number",
        options: _.union(["min", "max", "step"], inputView.prototype.options),

        min: null,
        max: null,
        step: 1,

        saveChange: function () {
            var val = this.$el.formData()[this.attribute];
            var numVal = parseInt(val);
            var toSet = null;
            if (typeof numVal === "number") {
                toSet = numVal;
                if (this.step) {
                    toSet = Math.round(numVal / this.step) * this.step;
                }
                if (this.max) {
                    toSet = Math.min(this.max, toSet);
                }
                if (this.min) {
                    toSet = Math.max(this.min, toSet);
                }
            }
            this.model.set(this.attribute, toSet);
            this.model.trigger("change:" + this.attribute);
        }

    });
});