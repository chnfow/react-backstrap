/**
 * Renders a table row of model attributes
 */
define(["react", "../mixins/Model", "underscore"], function (React, model, _) {
  "use strict";

  return _.rf({
    mixins: [model],
    render: function () {
      // wrap all the children attributes in table cells
      var children = _.map(this.getAttributes(), function (oneChildElement) {
        return React.DOM.td({}, oneChildElement);
      });
      return React.DOM.tr(_.extend({}, this.props), children);
    }
  });

});