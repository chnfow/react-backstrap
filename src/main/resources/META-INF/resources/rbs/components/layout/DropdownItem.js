/**
 * Bootstrap item in a dropdown menu
 */
define([ "react", "underscore", "./Icon" ],
  function (React, _, icon) {
    "use strict";
    var rpt = React.PropTypes;
    return _.rf({
      propTypes: {
        icon: rpt.node,
        caption: rpt.node,
        onClick: rpt.func
      },

      getDefaultProps: function () {
        return {
          onClick: _.noop
        };
      },


      handleClick: function () {
        this.props.onClick();
      },

      getIcon: function () {
        if (typeof this.props.icon === "string") {
          return icon({ key: "i", name: this.props.icon });
        }
        if (typeof this.props.icon !== "undefined") {
          return this.props.icon;
        }
        return null;
      },

      render: function () {
        var children = [ this.getIcon(), this.props.caption ];
        if (this.props.children) {
          children = children.concat(this.props.children);
        }
        return React.DOM.li({ onClick: this.handleClick }, React.DOM.a({ href: "#" }, children));
      }
    });
  });
