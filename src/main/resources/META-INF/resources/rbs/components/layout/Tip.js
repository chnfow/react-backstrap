/**
 * React Component that renders a question sign and a tooltip when hovered over
 */
define([ "react", "underscore", "./Icon" ], function (React, _, icon) {
  "use strict";

  return _.rf({
    displayName: "Tip",

    getInitialState: function () {
      return {
        open: false
      };
    },

    setTipState: function (state) {
      this.setState({
        open: state
      });
    },

    render: function () {
      return icon(_.extend({
        name: "question-sign"
      }, this.props, {
        onMouseEnter: _.bind(this.setTipState, this, true),
        onMouseLeave: _.bind(this.setTipState, this, false)
      }), this.props.children);
    }

  });
});