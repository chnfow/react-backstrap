define(["backbone", "underscore-extras"], function (Backbone, _) {
    "use strict";

    return Backbone.View.extend({
        options: ["modelView", "emptyEl"],

        views: {},
        emptyEl: null,

        initialize: function () {
            if (!this.collection) {
                console.error("CollectionViews must be initiated with a collection");
            }
            if (!this.modelView) {
                console.error("All collection views must be instantiated with a model view");
            }

            this.safeRerender = _.debounce(this.render, 50);
            this.syncViews();

            this.listenTo(this.collection, "add remove sort reset", _.debounce(this.syncViews, 10));
        },

        syncViews: function () {
            var newViews = {};
            // create views for any models that are in the collection and don't have views
            this.collection.each(function (oneModel) {
                newViews[oneModel.cid] = this.views[oneModel.cid] || new this.modelView({ model: oneModel });
            }, this);

            // call remove on the views that are no longer in the collection
            _.each(this.views, function (oneView) {
                if (!newViews[oneView.model.cid]) {
                    oneView.remove();
                }
            }, this);

            // set the views for this collection to the views
            this.views = newViews;
            this.safeRerender();
        },

        render: function () {
            this.$el.empty();
            this.applyAttributes();
            this.collection.each(function (oneModel) {
                if (_.canRender(this.views[oneModel.cid])) {
                    this.$el.append(this.views[oneModel.cid].render().el);
                }
            }, this);
            if (!this.collection.size() && this.emptyEl) {
                this.$el.append(this.emptyEl);
            }
            return this;
        },

        remove: function () {
            _.each(this.views, function (oneView) {
                oneView.remove();
            });
            Backbone.View.prototype.remove.apply(this, arguments);
        }

    });

});