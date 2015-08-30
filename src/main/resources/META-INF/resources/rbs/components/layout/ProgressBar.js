/**
 * Bootstrap progress bar
 */
define([ "react", "underscore" ], function (React, _) {
  "use strict";

  return _.rf({
    displayName: "Progress Bar",

    propTypes: {
      progress: React.PropTypes.number,
      striped: React.PropTypes.bool,
      active: React.PropTypes.bool,
      level: React.PropTypes.oneOf([ "success", "warning", "info", "danger" ]),
      showText: React.PropTypes.bool
    },

    getDefaultProps: function () {
      return {
        progress: 0,
        striped: true,
        active: true,
        level: null,
        showText: true
      };
    },

    render: function () {
      var width = this.props.progress + "%";
      var style = {
        width: width,
        minWidth: (this.props.showText) ? "3em" : null
      };
      var cn = [ "progress-bar" ];
      if (this.props.striped) {
        cn.push("progress-bar-striped");
      }
      if (this.props.active) {
        cn.push("active");
      }
      if (this.props.level !== null) {
        cn.push("progress-bar-" + this.props.level);
      }


      return React.DOM.div({ className: "progress" },
        React.DOM.div({
          role: "progressbar",
          className: cn.join(" "),
          style: style
        }, React.DOM.span({
          className: this.props.showText ? null : "sr-only"
        }, width))
      );
    }
  });
});