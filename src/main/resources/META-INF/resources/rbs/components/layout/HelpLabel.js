/**
 * React Component that renders a label plus some help text (to be implemented)
 */
define([ "react", "underscore", "./Tip" ], function (React, _, tip) {
  "use strict";

  return _.rf({
    displayName: "Helper Label",
    render: function () {
      return React.DOM.label(_.extend({}, this.props, {}), this.props.children);
    }
  });
});