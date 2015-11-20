/**
 * uses fixed positioning to fix the children to the top when the browser scrolls past it and the height of the window
 * can contain the children
 */
define([ "react", "util", "jquery", "underscore" ], function (React, util, $, _) {
  "use strict";

  var d = React.DOM;
  var rpt = React.PropTypes;

  return util.rf({
    displayName: "Div Fixed to top",

    propTypes: {
      buffer: rpt.number
    },

    getDefaultProps: function () {
      return {
        buffer: 25
      };
    },

    getInitialState: function () {
      return {
        fixed: false
      };
    },

    componentDidMount: function () {
      this.calculateStyle();
      this.boundStyle = _.bind(this.calculateStyle, this);
      $(window).on("resize scroll", this.boundStyle);
    },

    componentWillUnmount: function () {
      $(window).off("resize scroll", this.boundStyle);
    },

    calculateStyle: function () {
      if (!this.isMounted()) {
        return;
      }

      // window height and how far it's scrolled
      var w = $(window);
      var wst = w.scrollTop();
      var wht = w.height();

      // get the refs to the wrapper elements
      var container = $(this.refs.container);
      var wrapper = $(this.refs.wrapper);

      // this is used to determine whether the window is scrolled past where the element should be
      var containerOffset = container.offset();

      var fixed = false;

      if (
        // window is scrolled past the container's buffer zone
      wst > containerOffset.top - this.props.buffer &&
        // window height is enough to contain the entirety of the fixed element
      wht > this.props.buffer * 2 + wrapper.height()
      ) {
        fixed = true;
      }

      this.setState({
        fixed: fixed
      });
    },

    getStyle: function () {
      if (!this.state.fixed) {
        return this.props.style;
      } else {
        return _.extend({}, this.props, {
          position: "fixed",
          top: this.props.buffer,
          width: "inherit"
        });
      }
    },

    render: function () {
      var c = React.Children.only(this.props.children);

      return d.div({
        ref: "container"
      }, d.div(_.extend({}, this.props, {
        style: this.getStyle(),
        ref: "wrapper"
      }), c));
    }
  });
});