/**
 * Renders a table row of model attributes
 */
define([ "react", "../mixins/Model", "underscore", "util" ],
  function (React, model, _, util) {
    "use strict";

    var d = React.DOM;

    return util.rf({
      displayName: "Model Table Row",

      mixins: [ model, React.addons.PureRenderMixin ],

      wrapperFunction: function (comp, attr, index) {
        return d.td({
          key: "td-" + index,
          "data-title": attr.label
        }, comp);
      },

      render: function () {
        var children = this.getAttributes(this.props.attributes);

        return d.tr(_.extend({}, this.props), children);
      }
    });

  });
