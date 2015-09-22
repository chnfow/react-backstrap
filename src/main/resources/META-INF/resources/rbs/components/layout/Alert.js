/**
 * Renders a bootstrap alert
 */
define([ "react", "underscore", "./Icon" ], function (React, _, icon) {
  "use strict";

  return _.rf({
    displayName: "Layout Alert",

    mixins: [ React.addons.PureRenderMixin ],

    propTypes: {
      level: React.PropTypes.oneOf([ "success", "info", "danger", "warning" ]).isRequired,
      strong: React.PropTypes.node.isRequired,
      message: React.PropTypes.node.isRequired,
      icon: React.PropTypes.oneOfType([ React.PropTypes.node, React.PropTypes.string ])
    },

    getDefaultProps: function () {
      return {};
    },

    getClass: function () {
      var classes = [ "alert" ];
      if (typeof this.props.className === "string") {
        classes.push(this.props.className);
      }
      classes.push("alert-" + this.props.level);
      return classes.join(" ");
    },

    getIcon: function () {
      var ic = this.props.icon;
      if (typeof ic === "string") {
        ic = icon({ key: "icon", name: ic });
      }
      return ic;
    },

    render: function () {
      return React.DOM.div(_.extend({}, this.props, { className: this.getClass(), role: "alert" }), [
        this.getIcon(),
        React.DOM.strong({ key: "strong" }, this.props.strong),
        this.props.message
      ]);
    }
  });
});