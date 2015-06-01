/**
 * This view is a base for all the other input views, storing the common behavior of saving the attribute to the model
 * on any input change, and re-rendering on any model change (i.e. 2-way binding with smart re-rendering)
 */
define(["backbone", "underscore", "jquery-extensions", "underscore-extras"], function (Backbone, _) {
    "use strict";
    return Backbone.View.extend({

        options: ["attribute"],

        events: {
            "change": "saveChange",
            "change :input": "saveChange"
        },

        initialize: function () {
            if (!this.model) {
                console.error("Input views require a model on initialization");
            }

            if (this.attribute && this.attribute.length) {
                this.listenTo(this.model, "change:" + this.attribute, this.renderIfDifferent);
            }
        },

        attributes: function () {
            return {
                name: this.attribute
            };
        },

        /**
         * React to the changed model attribute by re-rendering if the value is different from what's currently visible
         */
        renderIfDifferent: function (model, value, options) {
            if (!_.isEqual(this.$el.formData()[this.attribute], value)) {
                this.render();
            }
        },

        saveChange: function () {
            this.model.set(this.$el.formData());
        }

    });

});