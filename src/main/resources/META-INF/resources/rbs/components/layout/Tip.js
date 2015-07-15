/**
 * React Component that renders a question sign and a tooltip when hovered over
 */
define([ "react", "underscore", "./Icon", "../controls/TimeoutTransitionGroup" ], function (React, _, icon, TTG) {
  "use strict";

  return _.rf({
    displayName: "Tip",

    propTypes: {
      tip: React.PropTypes.node.isRequired,
      icon: React.PropTypes.string
    },

    getDefaultProps: function () {
      return {
        icon: "question-circle"
      };
    },

    getInitialState: function () {
      return {
        open: false,
        toggled: false
      };
    },

    setTipState: function (state) {
      if (this.isMounted()) {
        this.setState({
          open: state
        });
      }
    },

    toggleTipState: function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (this.isMounted()) {
        this.setState({
          open: !this.state.open
        });
      }
    },

    render: function () {
      var info = null;
      if (this.state.open || this.state.toggled) {
        info = React.DOM.div({
          key: "tip",
          className: "tip"
        }, this.props.tip);
      }

      return React.DOM.span({
        className: "tip-container"
      }, [
        icon(_.extend({
          key: "icon",
          name: this.props.icon
        }, this.props, {
          onMouseEnter: _.bind(this.setTipState, this, true),
          onMouseLeave: _.bind(this.setTipState, this, false),
          onMouseDown: _.bind(this.toggleTipState, this)
        })),
        TTG({
          key: "info",
          transitionName: "fade-fast",
          leaveTimeout: 250,
          enterTimeout: 250
        }, info)
      ]);
    }

  });
});