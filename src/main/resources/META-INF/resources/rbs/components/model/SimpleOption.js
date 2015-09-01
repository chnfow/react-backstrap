/**
 * React Component
 */
define([ "react", "underscore", "./Div" ], function (React, _, model) {
  "use strict";

  return _.rf({
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