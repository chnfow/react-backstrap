define(["backbone", "underscore-extras", "jquery"], function (Backbone, _, $) {
    "use strict";

    return Backbone.View.extend({
        tagName: "button",
        options: ["onClick", "ajax", "disabled", "baseClass", "size", "type", "block", "submit", "icon", "caption"],
        baseClass: "btn",
        submit: false,
        ajax: false,
        block: false,

        initialize: function () {
            if (this.ajax) {
                $(document).ajaxStart(_.bind(this.setLoading, this, true));
                $(document).ajaxStop(_.bind(this.setLoading, this, false));
            }
        },

        setLoading: function (isLoading) {
            this.loading = isLoading;
            this.render();
        },

        attributes: function () {
            return {
                type: (this.submit) ? "submit" : "button",
                disabled: this.disabled || this.loading
            };
        },

        className: function () {
            var classes = [ this.baseClass ];
            if (this.size) {
                classes.push("btn-" + this.size);
            }
            if (this.type) {
                classes.push("btn-" + this.type);
            }
            if (this.block) {
                classes.push("btn-block");
            }
            return classes.join(" ");
        },

        events: {
            "click": "onClick"
        },

        render: function () {
            this.$el.empty();
            this.applyAttributes();
            this.$el.html(_.result(this, "caption"));
            if (this.icon) {
                this.$el.prepend(_.icon(this.icon));
            }
            return this;
        },

        onClick: function (e) {
            this.trigger("click", e);
        }

    });
});