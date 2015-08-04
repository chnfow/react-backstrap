/**
 * Renders a table row of model attributes
 */
define([ "react", "../mixins/Model", "underscore" ],
  function (React, model, _) {
    "use strict";

    return _.rf({
      displayName: "Model Table Row",

      mixins: [ model ],

      render: function () {
        // wrap all the children attributes in table cells
        var children = _.map(this.getAttributes(this.props.attributes), function (oneChildElement) {
          return React.DOM.td({
            key: "td-" + oneChildElement.key,
            "data-title": oneChildElement.props.label
          }, oneChildElement);
        });
        return React.DOM.tr(_.extend({}, this.props), children);
      }
    });

  });
