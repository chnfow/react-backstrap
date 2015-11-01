/**
 * React Component
 */
define([ "react", "underscore", "./Div", "util" ], function (React, _, model, util) {
  "use strict";

  return util.rf({
    mixins: [ React.addons.PureRenderMixin ],

    render: function () {
      return model(_.extend({}, this.props, {
        attributes: [
          {
            component: "icon",
            attribute: "icon"
          },
          {
            component: React.DOM.span,
            attribute: "name"
          }
        ]
      }));
    }
  });
});