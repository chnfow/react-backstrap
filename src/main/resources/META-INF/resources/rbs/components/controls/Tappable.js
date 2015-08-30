/**
 * Calls onClick or focuses the element when a "tap" happens and prevents the simulated click events from happening
 * Essentially a port of the functionality in FastClick
 */
define([ "react", "jquery", "underscore" ], function (React, $, _) {
  "use strict";

  return _.rf({
    propTypes: {
      // the number of px that the finger can move before the touch should no longer trigger the click event at touch end
      threshold: React.PropTypes.number,
      timeThreshold: React.PropTypes.number
    },

    getDefaultProps: function () {
      return {
        threshold: 20,
        timeThreshold: 300
      };
    },

    getInitialState: function () {
      return {
        touchId: null,
        touchX: null,
        touchY: null,
        touchTime: null
      };
    },

    // clear the touch data we've gathered
    clearTouchData: function (callback) {
      if (this.isMounted()) {
        this.setState({
          touchId: null,
          touchX: null,
          touchY: null,
          touchTime: null
        }, callback);
      }
    },

    handleTouchStart: function (e) {
      // one+ touches means the user isn't trying to tap this element
      if (e.touches.length !== 1 || e.targetTouches.length !== 1) {
        this.clearTouchData();
        return;
      }
      var tch = e.targetTouches[ 0 ];
      this.setState({
        touchId: tch.identifier,
        touchX: tch.screenX,
        touchY: tch.screenY,
        touchTime: (new Date()).getTime()
      });
    },

    handleTouchEnd: function (e) {
      if (this.state.touchId === null) {
        return;
      }
      // long press, don't do anything
      if (((new Date()).getTime() - this.state.touchTime > this.props.timeThreshold)) {
        this.clearTouchData();
        return;
      }
      // prevent the simulated mouse events
      e.preventDefault();
      // clear the data and then trigger the click
      this.clearTouchData(function () {
        this.triggerClick();
      });
    },

    handleTouchMove: function (e) {
      if (this.state.touchId === null) {
        return;
      }
      if (e.touches.length !== 1) {
        this.clearTouchData();
        return;
      }
      // find the touch from the changed touches (should be the only one)
      var tch = _.find(e.changedTouches, function (oneT) {
        return oneT.identifier === this.state.touchId;
      }, this);

      // this shouldn't ever happen
      if (!tch) {
        return;
      }
      // calculate how far it was moved
      var dist = Math.sqrt(Math.pow(tch.screenX - this.state.touchX, 2) + Math.pow(tch.screenY - this.state.touchY, 2));
      // if it was moved farther than the allowed amount, then we should cancel the touch
      if (dist > this.props.threshold) {
        this.clearTouchData();
      }
    },

    handleTouchCancel: function (e) {
      this.clearTouchData();
    },

    getOnClick: function () {
      var c = React.Children.only(this.props.children);
      return c.props.onClick;
    },

    triggerClick: function () {
      var oc = this.getOnClick();
      if (typeof oc === "function") {
        oc();
      } else {
        var el = $(React.findDOMNode(this));
        if (el.is(":input")) {
          el.focus();
        } else {
          el.click();
        }
      }
    },

    render: function () {
      return React.cloneElement(React.Children.only(this.props.children), {
        onTouchStart: this.handleTouchStart,
        onTouchEnd: this.handleTouchEnd,
        onTouchMove: this.handleTouchMove,
        onTouchCancel: this.handleTouchCancel
      });
    }
  });
});