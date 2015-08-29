/**
 * Calls onClick when a "tap" happens
 */
define([ "react", "underscore" ], function (React, _) {
  "use strict";

  return _.rf({
    propTypes: {
      // the number of px that the finger can move before the touch should no longer trigger the click event at touch end
      threshold: React.PropTypes.number
    },

    getDefaultProps: function () {
      return {
        threshold: 20
      };
    },

    getInitialState: function () {
      return {
        // when we trigger a click by touchend, this is set to true so the click event is not triggered twice
        clickEventTriggered: false,
        touchId: null,
        touchX: null,
        touchY: null
      };
    },

    // clear the touch data we've gathered
    clearTouchData: function () {
      if (this.isMounted()) {
        this.setState({
          touchId: null,
          touchX: null,
          touchY: null
        });
      }
    },

    handleTouchStart: function (e) {
      // not exactly one finger touching the element
      if (e.touches.length !== 1) {
        this.clearTouchData();
        return;
      }
      var tch = e.targetTouches[ 0 ];
      this.setState({ touchId: tch.identifier, touchX: tch.screenX, touchY: tch.screenY });
    },

    handleTouchEnd: function (e) {
      if (this.state.touchId === null) {
        return;
      }
      // prevent the click event
      e.preventDefault();
      this.setState({ touchId: null, touchX: null, touchY: null, clickEventTriggered: true }, function () {
        this.triggerClick();
      });
    },

    handleTouchMove: function (e) {
      if (this.state.touchId === null) {
        return;
      }
      // find the touch
      var tch = _.find(e.changedTouches, function (oneT) {
        return oneT.identifier === this.state.touchId
      }, this);
      // didn't find the touch
      if (!tch) {
        return;
      }
      // the touch was moved
      var dist = Math.sqrt(Math.pow(tch.screenX - this.state.touchX, 2) + Math.pow(tch.screenY - this.state.touchY, 2));
      // check the distance from the original touch
      if (dist > this.props.threshold) {
        this.clearTouchData();
      }
    },

    handleTouchCancel: function (e) {
      this.clearTouchData();
    },

    getChild: function () {
      return React.Children.only(this.props.children);
    },

    getOnClick: function () {
      var c = this.getChild();
      return c.props.onClick;
    },

    triggerClick: function (e) {
      var oc = this.getOnClick();
      if (typeof oc === "function") {
        oc(e);
      }
    },

    handleClick: function (e) {
      if (this.state.clickEventTriggered) {
        this.setState({
          clickEventTriggered: false
        });
        return false;
      }
      this.triggerClick(e);
    },

    render: function () {
      return React.cloneElement(React.Children.only(this.props.children), {
        onClick: this.handleClick,
        onTouchStart: this.handleTouchStart,
        onTouchEnd: this.handleTouchEnd,
        onTouchMove: this.handleTouchMove,
        onTouchCancel: this.handleTouchCancel
      });
    }
  });
});