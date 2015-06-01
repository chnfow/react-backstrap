define(["backbone", "jquery", "underscore", "./ContainerView", "./HeaderView", "bootstrap"], function (Backbone, $, _, containerView, headerView) {
    "use strict";
    return Backbone.View.extend({
        options: ["contentViews", "fade", "large", "title", "headerViews", "bodyViews", "footerViews"],
        views: [],
        fade: true,
        large: false,
        headerViews: null,
        title: null,
        footerViews: null,
        bodyViews: null,

        className: function () {
            var classes = ["modal"];
            if (this.fade) {
                classes.push("fade");
            }
            return classes.join(" ");
        },

        events: {
            "click .close": "hide",
            "show.bs.modal": "blurInputs",
            "shown.bs.modal": "focusFirstInput",
            "hidden.bs.modal": "remove"
        },

        blurInputs: function () {
            $(":focus").blur();
        },

        focusFirstInput: function () {
            this.$(":input:visible").first().focus();
        },

        initialize: function () {
            var contentViews = [];
            if (this.headerViews) {
                contentViews.push(new containerView({ className: "modal-header", views: this.headerViews }));
            } else {
                if (this.title) {
                    contentViews.push(new containerView({className: "modal-header", views: [ new headerView({tagName: "h4", text: this.title, className: "modal-title"}) ]}));
                }
            }
            if (this.bodyViews) {
                contentViews.push(new containerView({ className: "modal-body", views: this.bodyViews }));
            }
            if (this.footerViews) {
                contentViews.push(new containerView({ className: "modal-footer", views: this.footerViews }));
            }

            this.dialogView = new containerView({
                className: "modal-dialog",
                views: [
                    new containerView({
                        className: "modal-content",
                        views: contentViews
                    })
                ]
            });
        },

        done: function () {
            this.$el.modal("hide");
        },

        show: function () {
            this.render().$el.detach().appendTo("body");
            this.$el.modal("show");
        },

        render: function () {
            this.applyAttributes();
            this.$el.html(this.dialogView.render().$el);
            return this;
        },

        remove: function () {
            this.dialogView.remove();
            $(".modal-open").removeClass("modal-open");
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });
});