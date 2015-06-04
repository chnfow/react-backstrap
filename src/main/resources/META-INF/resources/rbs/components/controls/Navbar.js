/**
 * Uses the unordered list view and list item view to build a menu from a collection of links
 * Links have the attributes:
 * icon: name of icon to display
 * text: text for the link
 * link: link URL
 * dropdown: a collection of models with icon/text/link representing links in a submenu
 */
define(["backbone", "jquery", "../layout/ContainerView", "../collection/UnorderedListView", "../model/ListItemView", "Button", "underscore", "bootstrap"],
    function (Backbone, $, containerView, ulView, liView, buttonView, _) {
    "use strict";

    var anchorView = liView.extend({
        tagName: "a",
        modelAttributes: [
            {
                attribute: "icon",
                view: "icon"
            },
            {
                attribute: "text",
                view: "span"
            }
        ],

        attributes: function  () {
            return {
                href: this.model.get("link")
            };
        },

        initialize: function () {
            liView.prototype.initialize.apply(this, arguments);
            this.listenTo(this.model, "change:link", this.render);
        }
    });

    // one list item link in the navbar
    var linkView = liView.extend({
        modelAttributes: [
            {
                view: anchorView
            }
        ],

        initialize: function () {
            liView.prototype.initialize.apply(this, arguments);

            this.initializeDropdown();
            this.listenTo(this.model, "change:dropdown", this.initializeDropdown);
            this.listenTo(this.model, "change:display", _.debounce(_.bind(this.render, this), 10));
        },

        initializeDropdown: function () {
            if (this.model.has("dropdown")) {
                this.dropdown = new ulView({
                    className: "dropdown-menu",
                    attributes: {role: "menu"},
                    modelView: linkView,
                    collection: this.model.get("dropdown")
                });
            } else {
                this.dropdown = null;
            }
        },

        className: function () {
            var classes = [];
            // if the URL on the model is the current URL, mark this li active
            if (window.location.pathname === this.model.get("link")) {
                classes.push("active");
            }
            if (!this.model.has("text") && !this.model.has("link")) {
                classes.push("divider");
            }
            if (this.dropdown) {
                classes.push("dropdown");
            }
            return classes.join(" ");
        },

        render: function () {
            liView.prototype.render.apply(this, arguments);

            if (this.dropdown) {
                // create a caret icon to append
                var caret = $("<span></span>").addClass("caret");
                // make this link a dropdown toggle
                this.$el.find("a").addClass("dropdown-toggle").attr({ "data-toggle": "dropdown", "role": "button" })
                    .append(" ").append(caret);
                // add the ul to the li
                this.$el.append(this.dropdown.render().el);
            }

            if (this.model.get("display")) {
                this.$el.show();
            } else {
                this.$el.hide();
            }

            return this;
        }
    });

    return Backbone.View.extend({
        tagName: "nav",
        className: "navbar navbar-static-top",

        options: ["leftLinks", "rightLinks", "brandLink"],

        initialize: function () {

            this.identifier = _.randomString();
            this.expandButton = new buttonView({
                icon: "menu-hamburger",
                caption: "MENU",
                className: "navbar-toggle collapsed",
                attributes: _.partial(function (identifier) {
                    return _.extend(buttonView.prototype.attributes.apply(this, arguments), {
                        "data-toggle": "collapse",
                        "data-target": "#" + identifier
                    });
                }, this.identifier)
            });


            this.leftLinks = new ulView({
                className: "nav navbar-nav",
                modelView: linkView,
                collection: this.leftLinks
            });

            this.rightLinks = new ulView({
                className: "nav navbar-nav navbar-right",
                modelView: linkView,
                collection: this.rightLinks
            });

            this.navbarBrand = new (anchorView.extend({ className: "navbar-brand ignore-link" }))({
                model: this.brandLink
            });

            // organize it into a static navbar
            this.collapsibleNavbar = new containerView({ className: "collapse navbar-collapse", id: this.identifier, views: [ this.leftLinks, this.rightLinks ] });
            this.navbarHeader = new containerView({ className: "navbar-header", views: [ this.expandButton, this.navbarBrand ] });
            this.navbarContainer = new containerView({ className: "container", views: [ this.navbarHeader, this.collapsibleNavbar ] });

            this.listenTo(Backbone.history, "route", this.render);
        },

        render: function () {
            this.applyAttributes();
            this.$el.html(this.navbarContainer.render().el);
            return this;
        }
    });
});