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
        nextSlideTimeout: null,
        lastTransitionTime: null
      };
    },

    componentWillReceiveProps: function (nextProps) {
      // don't do anything if the new children are the same...
      if (nextProps.children === this.state.activeChildren) {
        return;
      }

      // we are getting new children, clear the timeout
      var timeAdjustment = 0;
      // if the last action was an entrance, then we need to add time for the enter transition to complete before
      // starting a new transition
      if (this.state.lastEnterTime) {
        timeAdjustment += Math.max(0, this.props.enterTimeout - ((new Date()).getTime() - this.state.lastEnterTime));
      }
      // if the last action was leaving, we need to remove time since we can just immediately transition to the next
      // active children
      if (this.state.lastLeaveTime) {
        timeAdjustment -= Math.max(0, this.props.leaveTimeout - ((new Date()).getTime() - this.state.lastLeaveTime));
      }

      // clear the existing timeout
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
            nextSlideTimeout: null,
            lastEnterTime: (new Date()).getTime(),
            lastLeaveTime: null
          });
        }, this), this.props.leaveTimeout + timeAdjustment),
        lastEnterTime: null,
        lastLeaveTime: (new Date()).getTime()
      });
    },

    render: function () {
      return TTG(_.extend({}, this.props), this.state.activeChildren);
    }
  });
});