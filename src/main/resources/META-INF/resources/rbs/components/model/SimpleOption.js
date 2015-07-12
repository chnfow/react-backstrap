/**
 * React Component
 */
define([ "react", "underscore", "./Model" ], function (React, _, model) {
  "use strict";

  return _.rf({
    render: function () {
      return model(_.extend({}, this.props, {
        attributes: [
          {
            component: "span",
            attribute: "name"
          }
        ]
      }));
    }
  });
});