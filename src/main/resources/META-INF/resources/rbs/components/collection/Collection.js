/**
 * Renders a collection in a div
 */
define(["react", "underscore", "../mixins/Collection"], function (React, _, collection) {
    "use strict";

    return _.rf({
        mixins: [collection],

        render: function () {
            return React.DOM.div(_.extend({}, this.props), this.getModels());
        }
    });

});