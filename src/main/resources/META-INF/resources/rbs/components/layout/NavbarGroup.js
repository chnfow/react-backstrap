/**
 * React Component
 */
define([ "react", "underscore" ], function (React, _) {
  "use strict";

  return _.rf({
    displayName: "Navbar Group",

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