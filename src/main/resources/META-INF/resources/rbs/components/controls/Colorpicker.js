define([ "react", "util", "underscore" ],
  function (React, util, _) {
    "use strict";

    var d = React.DOM;
    var rpt = React.PropTypes;


    var default_colors = [];

    var makeHex = function makeHex(r, g, b) {
      return r.toString(16) + g.toString(16) + b.toString(16);
    };

    for (var r = 21; r < 255; r += 42) {
      if (default_colors.length > 0) {
        default_colors.push([]);
      }
      for (var g = 21; g < 255; g += 42) {
        var row = [];
        for (var b = 21; b < 255; b += 42) {
          row.push(makeHex(r, g, b));
        }
        default_colors.push(row);
      }
    }
    util.debug(default_colors);

    return util.rf({
      displayName: "Colorpicker Input",

      mixins: [ React.addons.PureRenderMixin ],

      propTypes: {
        onChange: rpt.func.isRequired,
        value: rpt.string,
        colors: rpt.arrayOf(rpt.arrayOf(rpt.string))
      },

      getDefaultProps: function () {
        return {
          value: null,
          colors: default_colors
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

      doNothing: function (e) {
        e.preventDefault();
      },

      handleSelect: function (hex, e) {
        this.props.onChange(hex);
      },

      getSwatchContainer: function () {
        var cn = [ "colorpicker-swatch-container" ];
        if (this.state.open) {
          cn.push("colorpicker-swatch-container-open")
        }
        var val = this.props.value;
        var i = 0, ii = 0;
        return d.div({
          key: "colorpicker",
          className: cn.join(" "),
          onClick: this.doNothing
        }, [
          _.map(this.props.colors, function (row) {
            if (row.length === 0) {
              // splitter
              return d.hr({ key: i++ });
            }
            // how many columns are in this row
            var cols = Math.floor(12 / row.length);
            // single row div
            return d.div({ key: i++ }, _.map(row, function (hex) {

              var cn = [ "colorpicker-color-swatch" ];
              if (val === hex) {
                cn.push("color-selected");
              }
              return d.div({
                key: ii++,
                className: cn.join(" "),
                style: { backgroundColor: "#" + hex },
                onMouseDown: this.doNothing,
                onClick: _.bind(this.handleSelect, this, hex)
              });
            }, this))
          }, this)
        ]);
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