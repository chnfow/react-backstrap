define(["backbone", "underscore-extras"], function (Backbone, _) {
    "use strict";
    return Backbone.View.extend({
        options: ["views"],
        views: [],

        render: function () {
            this.$el.empty();
            _.each(this.views, function (oneView) {
                if (_.canRender(oneView)) {
                    this.$el.append(oneView.render().el);
                } else {
                    console.error("Cannot render view passed to containerView", oneView);
                }
            }, this);
            return this;
        }
    });
});