define([ "react", "util", "underscore" ],
  function (React, util, _) {
    "use strict";

    var d = React.DOM;
    var rpt = React.PropTypes;

    return util.rf({
      displayName: "Colorpicker Input",

      mixins: [ React.addons.PureRenderMixin ],

      propTypes: {
        onChange: rpt.func.isRequired,
        value: rpt.string
      },

      getDefaultProps: function () {
        return {
          value: null
        };
      },

      getInitialState: function () {
        return {
          open: false
        };
      },

      componentDidMount: function () {
      },
      componentWillReceiveProps: function (nextProps) {
      },
      componentWillUpdate: function (nextProps, nextState) {
      },
      componentDidUpdate: function (prevProps, prevState) {
      },
      componentWillUnmount: function () {
      },

      handleFocus: function () {
        this.setState({
          open: true
        });
      },
      handleBlur: function () {
        this.setState({
          open: false
        });
      },

      getSwatchContainer: function () {
        var cn = [ "colorpicker-swatch-container" ];
        if (this.state.open) {
          cn.push("colorpicker-swatch-container-open")
        }
        return d.div({
          key: "colorpicker",
          className: cn.join(" ")
        }, []);
      },

      render: function () {
        var inputProps = _.omit(_.extend({}, this.props, {
          type: "text",
          onFocus: this.handleFocus,
          onBlur: this.handleBlur
        }), "children");

        return d.div({
          className: "colorpicker-container"
        }, [
          d.div({
            key: "input",
            className: "colorpicker-input-container"
          }, d.input(inputProps)),
          this.getSwatchContainer()
        ])
      }
    });
  });