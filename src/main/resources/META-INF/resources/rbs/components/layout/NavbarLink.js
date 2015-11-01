/**
 * React Component
 */
define([ "react", "underscore", "rbs/components/layout/Icon" ], function (React, _, icon) {
  "use strict";

  var rpt = React.PropTypes;

  return _.rf({
    displayName: "Navbar Link",

    mixins: [ React.addons.PureRenderMixin ],

    propTypes: {
      text: rpt.node.isRequired,
      href: rpt.string,
      active: rpt.bool,
      onClick: rpt.func,
      icon: rpt.oneOfType([ rpt.string, rpt.node ])
    },

    getDefaultProps: function () {
      return {
        href: "#",
        active: false,
        icon: null
      };
    },

    getIcon: function () {
      if (typeof this.props.icon === "string") {
        return icon({ key: "link-icon", name: this.props.icon });
      } else if (this.props.icon !== null) {
        return React.DOM.span({ key: "link-icon" }, this.props.icon);
      }
      return null;
    },

    render: function () {
      var className = (this.props.active) ? "active " : "";
      if (this.props.className) {
        className += this.props.className;
      }
      // children of the anchor tag
      var children = [
        this.getIcon(),
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