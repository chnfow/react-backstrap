define(["./ModelView", "jquery", "underscore-extras"], function (modelView, $, _) {
    "use strict";
    return modelView.extend({
        tagName: "form",

        options: _.union(modelView.prototype.options, ["saveOnSubmit"]),
        saveOnSubmit: true,

        initialize: function () {
            modelView.prototype.initialize.apply(this, arguments);
            _.each(this.attributeViews, function (oneAttributeView) {
                oneAttributeView.addClass("form-control");
            }, this);
            this.submit = _.bind(this.submit, this);
        },

        events: {
            submit: "beforeSubmit"
        },

        render: function () {
            this.$el.empty();
            _.each(this.attributeViews, function (oneAttributeView) {
                var div = $("<div></div>").addClass("form-group");
                var randomIdentifier = "input-" + _.randomString();
                if (oneAttributeView.sourceObject.label) {
                    var label = $("<label></label>")
                        .addClass("control-label")
                        .text(oneAttributeView.sourceObject.label)
                        .attr("for", randomIdentifier);
                    div.append(label);
                }
                this.$el.append(div.append(oneAttributeView.render().el));
                oneAttributeView.$el.attr("id", randomIdentifier);
            }, this);
            return this;
        },

        beforeSubmit: function (e) {
            e.preventDefault();
            this.onSubmit(e);
        },

        onSubmit: function (e) {
            if (this.saveOnSubmit) {
                this.saveModel();
            }
        },

        submit: function () {
            var submitButton = $("<input />").attr("type", "submit").css("display", "none");
            submitButton.appendTo(this.$el);
            submitButton.click();
            submitButton.remove();
        }

    });
});