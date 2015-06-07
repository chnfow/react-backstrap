/**
 * Renders a collection in a div
 */
define(["react", "underscore", "../mixins/Collection"], function (React, _, collection) {
    "use strict";

    return _.rf({
        displayName: "Generic Collection View",

        mixins: [collection],

        propTypes: {
            tagName: React.PropTypes.string
        },

        getDefaultProps: function () {
            return {
                tagName: "div"
            };
        },

        render: function () {
            var containerType = React.DOM[this.props.tagName];
            if (!containerType) {
                containerType = React.DOM.div;
            }
            return containerType(_.extend({}, this.props), this.getModels());
        }
    });

});