/**
 * Renders model attributes into a div
 */
define([ "react", "../mixins/Model", "underscore" ],
  function (React, model, _) {
    "use strict";

    return _.rf({
      displayName: "Generic Model View",
      mixins: [ model, React.addons.PureRenderMixin ],
      render: function () {
        return React.DOM.div(_.extend({}, this.props), this.getAttributes(this.props.attributes));
      }
    });
  });