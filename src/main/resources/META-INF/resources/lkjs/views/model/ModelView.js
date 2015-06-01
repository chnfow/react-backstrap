define(["backbone", "jquery", "underscore", "../attribute/CheckboxView", "../attribute/EmailView", "../attribute/InputView",
        "../attribute/NumberView", "../attribute/PasswordView", "../attribute/SpanView",
        "../attribute/TextareaView", "../attribute/IconView", "../attribute/BadgeView", "../collection/SelectView", "jquery-extensions"],
    function (Backbone, $, _, checkbox, email, input, number, password, span, textarea, icon, badge, select) {
    "use strict";

    return Backbone.View.extend({

        options: ["modelAttributes"],

        commonViews: {
            "checkbox": checkbox,
            "email": email,
            "text": input,
            "number": number,
            "password": password,
            "span": span,
            "textarea": textarea,
            "icon": icon,
            "badge": badge,
            "select": select
        },

        modelAttributes: [
            //{
            //    attribute: "",
            //    view: null,
            //    viewOptionA: "abc",
            //    viewOptionB: "123"
            //}
        ],

        attributeViews: [],

        initialize: function () {
            this.createAttributeViews();
        },

        createAttributeViews: function () {
            // destroy all the existing attribute views
            _.each(this.attributeViews, function (oneView) {
                oneView.remove();
            });
            this.attributeViews = [];
            // create new views from the model attributes
            _.each(this.modelAttributes, function (oneAttribute) {
                // resolve common view names
                if (typeof oneAttribute.view === "string" && this.commonViews[oneAttribute.view]) {
                    oneAttribute.view = this.commonViews[oneAttribute.view];
                }
                // sanity check for proper usage
                if (typeof oneAttribute.view !== "function") {
                    console.error("View constructor must be passed in for each attribute.", oneAttribute);
                }
                oneAttribute.model = this.model;
                // create new attribute views
                var vw = new oneAttribute.view(oneAttribute);
                vw.sourceObject = oneAttribute;
                this.attributeViews.push(vw);
            }, this);
        },

        render: function () {
            this.$el.empty();
            this.applyAttributes();
            _.each(this.attributeViews, function (oneAttributeView) {
                this.$el.append(oneAttributeView.render().el);
            }, this);
            return this;
        },

        setModel: function () {
            this.model.set(this.$el.formData());
        },

        saveModel: function () {
            return this.model.save(this.$el.formData());
        },

        remove: function () {
            _.each(this.attributeViews, function (oneAttributeView) {
                oneAttributeView.remove();
            });
            Backbone.View.prototype.remove.apply(this, arguments);
        }

    });
});