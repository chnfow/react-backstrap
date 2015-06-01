define(["./SpanView", "underscore"], function (spanView, _) {
    "use strict";
    return spanView.extend({
        tagName: "a",
        options: _.union(spanView.prototype.options, ["href"]),

        attributes: function () {
            return {
                href: _.result(this, "href")
            };
        },

        render: function () {
            this.$el.html(_.result(this, "text"));
            return this;
        }
    });
});