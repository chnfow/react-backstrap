/**
 * React Component
 */
define([ "react", "underscore", "util" ], function (React, _, util) {
  "use strict";

  return util.rf({
    displayName: "Navbar Group",

    mixins: [ React.addons.PureRenderMixin ],

    propTypes: {
      right: React.PropTypes.bool
    },

    getDefaultProps: function () {
      return {
        right: false
      };
    },

    render: function () {
      var className = "nav navbar-nav" + (this.props.right ? " navbar-right" : "");
      if (typeof this.props.className === "string") {
        className += " " + this.props.className;
      }
      return React.DOM.ul(_.extend({}, this.props, {
        className: className
      }), this.props.children);
    }
  });
});