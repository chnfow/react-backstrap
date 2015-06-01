/**
 * Represents an input tag, type is specified in the type variable.
 */
define(["./CommonInput", "underscore"], function (commonInput, _) {
    "use strict";
    return commonInput.extend({
        tagName: "input",

        options: _.union(["type", "placeholder", "disabled", "required"], commonInput.prototype.options),
        type: "text",

        attributes: function () {
            return _.extend(commonInput.prototype.attributes.apply(this), {
                type: this.type,
                placeholder: this.placeholder,
                disabled: this.disabled,
                required: this.required
            });
        },

        render: function () {
            this.applyAttributes();
            this.$el.val(this.model.get(this.attribute));
            return this;
        }
    });
});