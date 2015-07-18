/**
 * React Component
 */
define([ "react", "underscore", "./Div" ], function (React, _, model) {
  "use strict";

  return _.rf({
    render: function () {
      return model(_.extend({}, this.props, {
        attributes: [
          {
            component: React.DOM.span,
            attribute: "name"
          }
        ]
      }));
    }
  });
});