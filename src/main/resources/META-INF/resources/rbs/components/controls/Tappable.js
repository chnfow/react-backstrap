/**
 * Calls onClick or focuses the element when a "tap" happens and prevents the simulated click events from happening
 * Essentially a port of the functionality in FastClick
 */
define([ "react", "jquery", "underscore", "util" ], function (React, $, _, util) {
  "use strict";

  return util.rf({
    displayName: "Tappable Control",

    propTypes: {
      // the number of px that the finger can move before the touch should no longer trigger the click event at touch end
      threshold: React.PropTypes.number,
      timeThreshold: React.PropTypes.number
    },

    getDefaultProps: function () {
      return {
        threshold: 15,
        timeThreshold: 125
      };
    },

    shouldComponentUpdate: function (nextProps) {
      return this.props.children !== nextProps.children;
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
      util.debug("clearing touch data");
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
        util.debug("multi-touch situation encountered on another touch start");
        this.clearTouchData();
        return;
      }
      var tch = e.targetTouches[ 0 ];
      util.debug("touch with ID", tch.identifier, "started");
      this.setState({
        touchId: tch.identifier,
        touchX: tch.screenX,
        touchY: tch.screenY,
        touchTime: (new Date()).getTime()
      });
    },

    handleTouchMove: function (e) {
      if (this.state.touchId === null) {
        util.debug("received touch move but not tracking touch");
        return;
      }

      if (e.touches.length !== 1 || e.targetTouches.length !== 1) {
        util.debug("touch moved in multi-touch scenario");
        this.clearTouchData();
        return;
      }

      var tch = e.targetTouches[ 0 ];
      if (this.state.touchId !== tch.identifier) {
        util.debug("touch identifier changed");
        this.clearTouchData();
        return;
      }

      // verify that the touch did not move outside the threshold
      var dist = Math.sqrt(Math.pow(tch.screenX - this.state.touchX, 2) + Math.pow(tch.screenY - this.state.touchY, 2));
      // if it was moved farther than the allowed amount, then we should cancel the touch
      if (dist > this.props.threshold) {
        util.debug("touch moved too far to count as tap");
        this.clearTouchData();
      }
    },

    handleTouchEnd: function (e) {
      if (this.state.touchId === null) {
        util.debug("touch ended but no touch is being tracked");
        return;
      }

      if (this.props.timeThreshold !== null) {
        // length of press exceeds the amount of time that we are doing anything for
        if (((new Date()).getTime() - this.state.touchTime > this.props.timeThreshold)) {
          util.debug("touch was for too long to be a tap");
          this.clearTouchData();
          return;
        }
      }

      // still a touch remaining
      if (e.touches.length !== 0) {
        util.debug("still touches remaining, not a tap.");
        this.clearTouchData();
        return;
      }

      // get the touch from the list of changed touches
      var tch = _.find(e.changedTouches, function (oneTouch) {
        return oneTouch.identifier === this.state.touchId;
      }, this);

      if (!tch) {
        util.debug("no touch found with the identifier", this.state.touchId, "touch end skipped.");
        this.clearTouchData();
        return;
      }

      util.debug("touch with ID", tch.identifier, "ended");

      var target = tch.target;

      // prevent the simulated mouse events
      e.preventDefault();
      // we don't need this touch end event to be handled multiple times if it's interpreted as a click
      e.stopPropagation();
      // clear the data and then trigger the click
      this.clearTouchData(function () {
        this.triggerClick(target);
      });
    },

    handleTouchCancel: function () {
      this.clearTouchData();
    },

    triggerClick: function (target) {
      while (target && typeof target.click !== "function") {
        target = target.parentNode;
      }

      if (!target) {
        util.debug("click function not found on target node nor its parent nodes");
        return;
      }

      util.debug("triggering click on", target);
      target.click();

      var el = $(target);
      var isCheckbox = el.is("[type=checkbox]");
      var isInput = el.is("input");
      var isSelect = el.is("select");
      var isTextArea = el.is("textarea");
      // since click doesn't focus a
      if ((isInput && !isCheckbox) || isSelect || isTextArea) {
        target.focus();
      }
    },

    render: function () {
      return React.cloneElement(React.Children.only(this.props.children), {
        onTouchStart: this.handleTouchStart,
        onTouchMove: this.handleTouchMove,
        onTouchEnd: this.handleTouchEnd,
        onTouchCancel: this.handleTouchCancel
      });
    }
  });
});