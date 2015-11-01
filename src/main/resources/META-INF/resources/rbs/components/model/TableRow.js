/**
 * Renders a table row of model attributes
 */
define([ "react", "../mixins/Model", "underscore", "util" ],
  function (React, model, _, util) {
    "use strict";

    return util.rf({
      displayName: "Model Table Row",

      mixins: [ model, React.addons.PureRenderMixin ],

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
