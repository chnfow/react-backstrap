/**
 * Bootstrap item in a dropdown menu
 */
define([ "react", "underscore", "./Icon", "util" ],
  function (React, _, icon, util) {
    "use strict";
    var rpt = React.PropTypes;
    var d = React.DOM;
    return util.rf({
      displayName: "Dropdown Item",

      mixins: [ React.addons.PureRenderMixin ],

      propTypes: {
        caption: rpt.node.isRequired,
        icon: rpt.node,
        href: rpt.string,
        onClick: rpt.func
      },

      getDefaultProps: function () {
        return {
          href: "#",
          icon: null
        };
      },


      handleClick: function (e) {
        if (typeof this.props.onClick === "function") {
          this.props.onClick(e);
        }
      },

      getIcon: function () {
        if (typeof this.props.icon === "string") {
          return icon({ key: "i", name: this.props.icon });
        } else {
          return this.props.icon;
        }
      },

      render: function () {
        var children = [ this.getIcon(), this.props.caption ];
        if (this.props.children) {
          children = children.concat(this.props.children);
        }
        return d.li({ onClick: this.handleClick }, d.a({
          href: this.props.href
        }, children));
      }
    });
  });
