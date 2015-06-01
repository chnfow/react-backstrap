define(["backbone", "underscore-extras", "jquery"], function (Backbone, _, $) {
    "use strict";
    return Backbone.View.extend({
        options: ["columns", "size"],
        columns: [],
        size: "md",
        className: "row",

        render: function () {
            _.each(this.columns, function (oneCol) {
                var col = $("<div></div>");
                col.addClass("col-" + this.size + "-" + oneCol.columns);

                if (_.canRender(oneCol.view)) {
                    col.append(oneCol.view.render().el);
                }

                this.$el.append(col);
            }, this);
            return this;
        },

        remove: function () {
            _.each(this.columns, function (oneCol) {
                if (_.canRemove(oneCol.view)) {
                    oneCol.view.remove();
                }
            });
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });
});