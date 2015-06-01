define(["underscore-extras", "./SpanView"], function(_, spanView) {
    "use strict";

    return spanView.extend({
        render: function () {
            this.$el.html(_.icon(this.model.get(this.attribute)));
            return this;
        }
    });
});