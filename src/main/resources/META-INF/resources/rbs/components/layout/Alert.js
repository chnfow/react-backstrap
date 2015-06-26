/**
 * React Component
 */
define(["react", "underscore", "backbone", "../model/Alert"], function (React, _, Backbone, alert) {
  "use strict";

  return _.rf({
    displayName: "Layout Alert",

    propTypes: {
      level: React.PropTypes.oneOf(["success", "info", "danger", "warning"]),
      strong: React.PropTypes.node.isRequired,
      message: React.PropTypes.node.isRequired,
      icon: React.PropTypes.string
    },

    getDefaultProps: function () {
      return {};
    },

    render: function () {
      var tempModel = new Backbone.Model(this.props);
      return alert(_.extend({}, this.props, {model: tempModel}));
    }
  });
});