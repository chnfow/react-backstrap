/**
 * Renders a collection as the children of a div
 */
define([ "react", "underscore", "../mixins/Collection" ], function (React, _, collection) {
  "use strict";

  return _.rf({
    displayName: "Div Collection View",

    mixins: [ collection, React.addons.PureRenderMixin ],

    propTypes: {},

    getDefaultProps: function () {
      return {};
    },

    render: function () {
      return React.DOM.div(_.omit(_.extend({}, this.props), "modelComponent", "collection"), this.getModels());
    }
  });

});
