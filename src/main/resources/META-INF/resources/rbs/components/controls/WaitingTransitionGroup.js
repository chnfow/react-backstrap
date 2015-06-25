/**
 * This transition group wraps a regular timeout transition group, but waits for at least the duration of the leave
 * animation before setting new children so as not to displace the existing children. Perfect for wrapping full page
 * elements that should fully transition before being replaced by new elements
 */
define(["react", "underscore", "./TimeoutTransitionGroup"], function (React, _, TTG) {
  "use strict";

  return _.rf({
    displayName: "Waiting Transition Group",

    getInitialState: function () {
      return {
        activeChildren: this.props.children,
        nextActiveChildren: null,
        nextSlideTimeout: null
      };
    },

    componentWillReceiveProps: function (nextProps) {
      // we are getting new children, clear the timeout
      if (this.state.nextSlideTimeout) {
        clearTimeout(this.state.nextSlideTimeout);
      }

      this.setState({
        nextActiveChildren: nextProps.children,
        activeChildren: null,
        nextSlideTimeout: setTimeout(_.bind(function () {
          this.setState({
            activeChildren: this.state.nextActiveChildren,
            nextActiveChildren: null,
            nextSlideTimeout: null
          });
        }, this), this.props.leaveTimeout)
      });
    },

    render: function () {
      return TTG(_.extend({}, this.props), this.state.activeChildren);
    }
  });
});