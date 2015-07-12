/**
 * React Component
 */
define([ "react", "underscore", "rbs/components/layout/Icon" ], function (React, _, icon) {
  "use strict";

  return _.rf({
    displayName: "Navbar Link",

    propTypes: {
      active: React.PropTypes.bool,
      href: React.PropTypes.string.isRequired,
      icon: React.PropTypes.string.isRequired,
      text: React.PropTypes.node.isRequired
    },

    getDefaultProps: function () {
      return {
        active: false
      };
    },

    render: function () {
      var className = (this.props.active) ? "active " : "";
      if (this.props.className) {
        className += this.props.className;
      }
      // children of the anchor tag
      var children = [
        icon({ key: "link-icon", name: this.props.icon }),
        this.props.text
      ];
      // add any children to the anchor tag
      if (this.props.children) {
        if (_.isArray(this.props.children)) {
          children = children.concat(this.props.children);
        } else {
          children.push(this.props.children);
        }
      }
      return React.DOM.li({
        className: className,
        onClick: this.props.onClick
      }, React.DOM.a({ href: this.props.href }, children));
    }
  });
});