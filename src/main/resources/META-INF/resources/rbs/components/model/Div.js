/**
 * Renders model attributes into a div
 */
define([ "react", "../mixins/Model", "underscore", "util" ],
  function (React, model, _, util) {
    "use strict";

    return util.rf({
      displayName: "Generic Model View",
      mixins: [ model, React.addons.PureRenderMixin ],
      render: function () {
        return React.DOM.div(_.extend({}, this.props), this.getAttributes(this.props.attributes));
      }
    });
  });