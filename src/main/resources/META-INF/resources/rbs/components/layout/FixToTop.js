/**
 * uses relative positioning to fix the children to the top
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
        style: {
          position: "relative",
          top: 0
        }
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

    componentDidUpdate: function (prevProps, prevState) {
      if (prevProps.children !== this.props.children) {
        this.calculateStyle();
      }
    },

    calculateStyle: function () {
      if (!this.isMounted()) {
        return;
      }
      var style = {
        position: "relative"
      };

      var w = $(window);
      var wst = w.scrollTop();
      var wht = w.height();
      var el = $(this.refs.wrapper);
      var of = el.offset();
      var top = of.top - this.state.style.top;

      if (wst > top - this.props.buffer && wht > this.props.buffer * 2 + el.height()) {
        style.top = wst - (top - this.props.buffer);
      } else {
        style.top = 0;
      }

      this.setState({
        style: style
      });
    },

    render: function () {
      var c = React.Children.only(this.props.children);

      return d.div({
        style: this.state.style,
        ref: "wrapper"
      }, c);
    }
  });
});