define(["backbone", "./ContainerView", "jquery"], function (Backbone, containerView, $) {
    "use strict";
    return Backbone.View.extend({
        options: ["text", "small", "break", "views", "center"],
        text: "Header Text",
        small: null,
        break: true,
        center: false,
        views: [],

        className: function () {
            var classes = [];
            classes.push("page-header");
            if (this.center) {
                classes.push("text-center");
            }
            return classes.join(" ");
        },
        tagName: "h1",

        initialize: function () {
            this.floatedViews = new containerView({
                className: "pull-right",
                views: this.views
            });
        },

        render: function () {
            this.$el.text(this.text);
            if (this.small) {
                if (this.break) {
                    this.$el.append($("<br />"));
                }
                this.$el.append($("<small></small>").text(this.small));
            }
            this.$el.prepend(this.floatedViews.render().el);
            return this;
        },

        remove: function () {
            this.floatedViews.remove();
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });
});