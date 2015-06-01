define(["backbone", "underscore", "./CollectionView", "../model/AlertView"], function (Backbone, _, collectionView, alertView) {
    "use strict";
    return collectionView.extend({
        modelView: alertView,

        options: _.union(collectionView.prototype.options, ["watch", "defaultType", "defaultIcon", "successMessage"]),
        successMessage: null,
        defaultType: "danger",
        defaultIcon: "warning-sign",

        initialize: function () {
            if (!this.collection) {
                this.collection = new Backbone.Collection();
            }
            if (this.watch) {
                this.listenTo(this.watch, "error", this.parseErrors);
                this.listenTo(this.watch, "invalid", this.parseValidationErrors);
                this.listenTo(this.watch, "sync", this.showSuccess);
                this.listenTo(this.watch, "request", this.clear);
            }
            collectionView.prototype.initialize.apply(this, arguments);
        },

        parseErrors: function (model_or_collection, resp, options) {
            var messages = (resp && resp.responseJSON) ? resp.responseJSON : [];

            this.setDefaults(messages);

            this.collection.reset(messages);
        },

        setDefaults: function (arrayOfErrors) {
            _.each(arrayOfErrors, function (oneError) {
                oneError.type = oneError.type || this.defaultType;
                oneError.icon = oneError.icon || this.defaultIcon;
            }, this);
        },

        showSuccess: function () {
            if (this.successMessage) {
                this.collection.reset([{
                    icon: "thumbs-up",
                    type: "success",
                    message: this.successMessage
                }]);
            }
        },

        parseValidationErrors: function (model, error, options) {
            var messages = [];
            if (_.isArray(error)) {
                messages = error;
            }
            if (typeof error === "string") {
                messages = [
                    {
                        message: error
                    }
                ];
            }
            if (typeof error === "object") {
                messages = [error];
            }

            this.setDefaults(messages);

            this.collection.reset(messages);
        },

        clear: function () {
            this.collection.reset();
        }

    });
});