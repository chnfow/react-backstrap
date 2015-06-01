define(["./CommonInput", "underscore-extras"], function (commonInput, _) {
    "use strict";
    return commonInput.extend({
        tagName: "textarea",

        render: function () {
            this.$el.val(this.model.get(this.attribute));
            return this;
        }
    });
});