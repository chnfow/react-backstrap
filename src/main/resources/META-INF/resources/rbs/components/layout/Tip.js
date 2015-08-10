/**
 * React Component that renders a question sign and a tooltip when hovered over
 */
define([ "react", "underscore", "../controls/TimeoutTransitionGroup" ], function (React, _, TTG) {
  "use strict";

  return _.rf({
    displayName: "Tip",

    propTypes: {
      tip: React.PropTypes.node.isRequired,
      //placement: React.PropTypes.oneOf([ "top", "right", "left", "bottom" ])
    },

    getDefaultProps: function () {
      return {
        //placement: "top"
      };
    },

    getInitialState: function () {
      return {
        open: false
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
      var className = [ "tip-container" ];

      if (this.state.open) {
        className.push("tip-container-open");
      }

      return React.DOM.span({
        className: className.join(" ")
      }, [
        React.DOM.span(_.extend(_.omit(this.props, "placement"), {
          key: "content",
          onMouseEnter: _.bind(this.setTipState, this, true),
          onMouseLeave: _.bind(this.setTipState, this, false),
          onClick: _.bind(this.toggleTipState, this)
        }), this.props.children),
        React.DOM.span({
          className: "tip tip-" + this.props.placement,
          key: "tip"
        }, this.props.tip)
      ]);
    }

  });
});
