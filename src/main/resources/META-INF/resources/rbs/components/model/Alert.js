/**
 * Renders a model representing an alert into a bootstrap alert
 */
define([ "react", "underscore", "../mixins/Model" ], function (React, _, model) {
    "use strict";

    return _.rf({
        displayName: "Model Alert",

        getDefaultProps: function () {
            return {
                attributes: [
                    {
                        key: "icon",
                        attribute: "icon",
                        component: "icon"
                    },
                    {
                        key: "strong",
                        attribute: "strong",
                        component: React.DOM.strong
                    },
                    {
                        key: "message",
                        attribute: "message",
                        component: React.DOM.span
                    }
                ]
            }
        },

        mixins: [ model ],

        render: function () {
            var level = this.state.model.level;
            if (!level) {
                level = "info";
            }

            var className = "alert alert-" + level;
            if (this.props.className) {
                className += " " + this.props.className;
            }

            return React.DOM.div(_.extend({}, this.props, {
                className: className,
                role: "alert"
            }), this.getAttributes(this.props.attributes));
        }
    });
});