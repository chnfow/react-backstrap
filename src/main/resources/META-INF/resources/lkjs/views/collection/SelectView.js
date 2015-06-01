define(["./CollectionView", "underscore", "jquery", "../attribute/CommonInput", "selectize"],
    function (collectionView, _, $, commonInput) {
    "use strict";

    return collectionView.extend({
        tagName: "select",

        options: _.union(collectionView.prototype.options, commonInput.prototype.options, ["multiple", "required", "placeholder"]),
        multiple: false,
        required: false,
        placeholder: "Select an option",

        events: commonInput.prototype.events,

        attributes: function () {
            return {
                multiple: this.multiple,
                required: this.required,
                name: this.attribute
            };
        },

        initialize: function () {
            commonInput.prototype.initialize.apply(this, arguments);
            collectionView.prototype.initialize.apply(this, arguments);
        },

        renderIfDifferent: commonInput.prototype.renderIfDifferent,

        render: function () {
            this.destroySelectize();
            collectionView.prototype.render.apply(this, arguments);
            if (this.placeholder) {
                this.$el.prepend($("<option></option>").attr("value", "").html(this.placeholder));
            }
            this.$el.val(this.model.get(this.attribute));
            this.initSelectize();
            return this;
        },

        destroySelectize: function () {
            var selectize = this.$el[0].selectize;
            if (selectize) {
                selectize.destroy();
            }
        },

        initSelectize: function () {
            this.$el.selectize(this.getSelectizeOptions());
        },

        getSelectizeOptions:function () {
            return {};
        },

        saveChange: commonInput.prototype.saveChange,

        remove: function () {
            this.destroySelectize();
            collectionView.prototype.remove.apply(this, arguments);
        }

    });

});