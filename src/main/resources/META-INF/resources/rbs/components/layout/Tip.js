/**
 * React Component that renders a question sign and a tooltip when hovered over
 */
define([ "react", "underscore", "../controls/TimeoutTransitionGroup" ], function (React, _, TTG) {
  "use strict";

  return _.rf({
    displayName: "Tip",

    propTypes: {
      tip: React.PropTypes.node.isRequired,
      placement: React.PropTypes.oneOf([ "top", "right", "left", "bottom" ])
    },

    getDefaultProps: function () {
      return {
        placement: "right"
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
        info = React.DOM.span({
          className: "tip-" + this.props.placement,
          key: "tip"
        }, [
          React.DOM.div({ className: "tip", key: "t" }, this.props.tip),
          React.DOM.span({ className: "arrow", key: "a" })
        ]);
      }

      return React.DOM.span({
        className: "tip-container"
      }, [
        React.DOM.span(_.extend(_.omit(this.props, "placement"), {
          key: "content",
          onMouseEnter: _.bind(this.setTipState, this, true),
          onMouseLeave: _.bind(this.setTipState, this, false),
          onMouseDown: _.bind(this.toggleTipState, this)
        }), this.props.children),
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
