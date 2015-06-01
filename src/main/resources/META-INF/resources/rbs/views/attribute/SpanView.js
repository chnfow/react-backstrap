define(["./CommonInput", "underscore-extras"], function (commonInput, _) {
    "use strict";
    return commonInput.extend({
        tagName: "span",

        options: _.union(["formatFunction", "renderNull"], commonInput.prototype.options),
        renderNull: false,

        attributes: {},

        render: function () {
            var val = (this.attribute) ? this.model.get(this.attribute) : null;
            if (this.renderNull || (typeof val !== "undefined" && val !== null)) {
                this.$el.html(this.formatFunction(val));
            } else {
                this.$el.empty();
            }
            return this;
        },

        formatFunction: function (val) {
            return _.clean(_.escape(val));
        }
    });
});