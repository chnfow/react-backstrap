/**
 * The CSSTransitionGroup component uses the 'transitionend' event, which
 * browsers will not send for any number of reasons, including the
 * transitioning node not being painted or in an unfocused tab.
 *
 * This TimeoutTransitionGroup instead uses a user-defined timeout to determine
 * when it is a good time to remove the component. Currently there is only one
 * timeout specified, but in the future it would be nice to be able to specify
 * separate timeouts for enter and leave, in case the timeouts for those
 * animations differ. Even nicer would be some sort of inspection of the CSS to
 * automatically determine the duration of the animation or transition.
 *
 * This is adapted from Facebook's CSSTransitionGroup which is in the React
 * addons and under the Apache 2.0 License.
 */
define(["react", "underscore", "raf"], function (React, _) {
  "use strict";
  var ReactTransitionGroup = React.createFactory(React.addons.TransitionGroup);

  /**
   * EVENT_NAME_MAP is used to determine which event fired when a
   * transition/animation ends, based on the style property used to
   * define that event.
   */
  var EVENT_NAME_MAP = {
    transitionend: {
      'transition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'mozTransitionEnd',
      'OTransition': 'oTransitionEnd',
      'msTransition': 'MSTransitionEnd'
    },

    animationend: {
      'animation': 'animationend',
      'WebkitAnimation': 'webkitAnimationEnd',
      'MozAnimation': 'mozAnimationEnd',
      'OAnimation': 'oAnimationEnd',
      'msAnimation': 'MSAnimationEnd'
    }
  };

  var endEvents = [];

  (function detectEvents() {
    if (typeof window === "undefined") {
      return;
    }

    var testEl = document.createElement('div');
    var style = testEl.style;

    // On some platforms, in particular some releases of Android 4.x, the
    // un-prefixed "animation" and "transition" properties are defined on the
    // style object but the events that fire will still be prefixed, so we need
    // to check if the un-prefixed events are useable, and if not remove them
    // from the map
    if (!('AnimationEvent' in window)) {
      delete EVENT_NAME_MAP.animationend.animation;
    }

    if (!('TransitionEvent' in window)) {
      delete EVENT_NAME_MAP.transitionend.transition;
    }

    for (var baseEventName in EVENT_NAME_MAP) {
      if (EVENT_NAME_MAP.hasOwnProperty(baseEventName)) {
        var baseEvents = EVENT_NAME_MAP[baseEventName];
        for (var styleName in baseEvents) {
          if (styleName in style) {
            endEvents.push(baseEvents[styleName]);
            break;
          }
        }

      }
    }
  })();

  function animationSupported() {
    return endEvents.length !== 0;
  }

  /**
   * Functions for element class management to replace dependency on jQuery
   * addClass, removeClass and hasClass
   */
  function addClass(element, className) {
    if (element.classList) {
      element.classList.add(className);
    } else if (!hasClass(element, className)) {
      element.className = element.className + ' ' + className;
    }
    return element;
  }

  function removeClass(element, className) {
    if (hasClass(className)) {
      if (element.classList) {
        element.classList.remove(className);
      } else {
        element.className = (' ' + element.className + ' ')
          .replace(' ' + className + ' ', ' ').trim();
      }
    }
    return element;
  }

  function hasClass(element, className) {
    if (element.classList) {
      return element.classList.contains(className);
    } else {
      return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
    }
  }

  var TimeoutTransitionGroupChild = _.rf({
    displayName: "TimeoutTransitionGroupChild",

    transition: function (animationType, finishCallback) {
      var node = React.findDOMNode(this);
      var className = this.props.name + '-' + animationType;
      var activeClassName = className + '-active';

      var endListener = function () {
        removeClass(node, className);
        removeClass(node, activeClassName);

        // Usually this optional callback is used for informing an owner of
        // a leave animation and telling it to remove the child.
        if (finishCallback) {
          finishCallback();
        }
      };

      if (!animationSupported()) {
        endListener();
      } else {
        if (animationType === "enter") {
          this.animationTimeout = setTimeout(endListener, this.props.enterTimeout);
        } else if (animationType === "leave") {
          this.animationTimeout = setTimeout(endListener, this.props.leaveTimeout);
        }
      }

      addClass(React.findDOMNode(this), className);

      this.queueClass(activeClassName);
    },

    queueClass: function (className) {
      this.classNameQueue.push(className);

      if (!this.timeout) {
        this.timeout = window.requestAnimationFrame(this.flushClassNameQueue);
      }
    },

    flushClassNameQueue: function () {
      this.timeout = null;
      if (this.classNameQueue.length > 0) {
        var nextClass = this.classNameQueue.shift();
        addClass(React.findDOMNode(this), nextClass);
        this.timeout = window.requestAnimationFrame(this.flushClassNameQueue);
      }
    },

    componentWillMount: function () {
      this.classNameQueue = [];
    },

    componentWillUnmount: function () {
      if (this.timeout) {
        window.cancelAnimationFrame(this.timeout);
      }
      if (this.animationTimeout) {
        clearTimeout(this.animationTimeout);
      }
    },

    componentWillEnter: function (done) {
      if (this.props.enter) {
        this.transition('enter', done);
      } else {
        done();
      }
    },

    componentWillLeave: function (done) {
      if (this.props.leave) {
        this.transition('leave', done);
      } else {
        done();
      }
    },

    render: function () {
      return React.Children.only(this.props.children);
    }
  });

  return _.rf({
    displayName: "TimeoutTransitionGroup",

    propTypes: {
      enterTimeout: React.PropTypes.number.isRequired,
      leaveTimeout: React.PropTypes.number.isRequired,
      transitionName: React.PropTypes.string.isRequired,
      transitionEnter: React.PropTypes.bool,
      transitionLeave: React.PropTypes.bool
    },

    getDefaultProps: function () {
      return {
        transitionEnter: true,
        transitionLeave: true
      };
    },

    _wrapChild: function (child) {
      return TimeoutTransitionGroupChild({
        enterTimeout: this.props.enterTimeout,
        leaveTimeout: this.props.leaveTimeout,
        name: this.props.transitionName,
        enter: this.props.transitionEnter,
        leave: this.props.transitionLeave
      }, child);
    },

    render: function () {
      return ReactTransitionGroup(_.extend({}, this.props, {childFactory: this._wrapChild}));
    }
  });

});