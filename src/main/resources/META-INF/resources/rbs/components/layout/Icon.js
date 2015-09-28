/**
 * Renders a FontAwesome icon. Be sure to include the rbs.css file to use fontawesome.
 */
define([ "react", "underscore" ], function (React, _) {
  "use strict";

  return _.rf({
    displayName: "Icon",

    mixins: [ React.addons.PureRenderMixin ],

    propTypes: {
      name: React.PropTypes.string,
      size: React.PropTypes.oneOf([ "lg", "2x", "3x", "4x", "5x" ]),
      fixedWidth: React.PropTypes.bool,
      animate: React.PropTypes.oneOf([ "spin", "pulse" ]),
      rotate: React.PropTypes.oneOf([ "90", "180", "270" ]),
      flip: React.PropTypes.oneOf([ "horizontal", "vertical" ])
    },

    render: function () {
      if (!this.props.name) {
        return null;
      }
      var classes = [];
      if (this.props.name) {
        classes.push("fa");
        classes.push("fa-" + this.props.name);
      }
      if (this.props.size) {
        classes.push("fa-" + this.props.size);
      }
      if (this.props.animate) {
        classes.push("fa-" + this.props.animate);
      }
      if (this.props.fixedWidth) {
        classes.push("fa-fw");
      }
      if (this.props.rotate) {
        classes.push("fa-rotate-" + this.props.rotate);
      }
      if (this.props.flip) {
        classes.push("fa-flip-" + this.props.flip);
      }
      if (this.props.className) {
        classes.push(this.props.className);
      }
      return React.DOM.i(_.extend({}, this.props, {
        className: classes.join(" ")
      }));
    }
  });
});