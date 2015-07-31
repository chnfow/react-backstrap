/**
 * React Component
 */
define([ "react", "underscore", "modernizr", "moment", "../layout/Icon" ], function (React, _, Modernizr, moment, icon) {
  "use strict";

  var KEY_ENTER = 13;
  var KEY_N = 78;
  var KEY_T = 84;

  return _.rf({
    propTypes: {
      onChange: React.PropTypes.func.isRequired,
      value: React.PropTypes.string,
      allowedFormats: React.PropTypes.arrayOf(React.PropTypes.string),
      saveFormat: React.PropTypes.string,
      displayFormat: React.PropTypes.string,
      polyfillOnly: React.PropTypes.bool
    },

    getDefaultProps: function () {
      return {
        allowedFormats: [ "HH:mm", "H:mm", "hh:mma", "h:mma", "hh:mmA", "h:mmA", "hh:mm A", "h:mm A" ],
        saveFormat: "HH:mm",
        displayFormat: "h:mm A",
        polyfillOnly: false
      };
    },

    parseStringToMoment: function (string) {
      var mt = moment.utc(string, this.props.allowedFormats, true);
      if (!mt.isValid()) {
        return null;
      }
      return mt;
    },

    getInitialState: function () {
      return {
        open: false,
        transientValue: this.props.value,
        transientMoment: this.parseStringToMoment(this.props.value)
      };
    },

    handleFocus: function () {
      if (this.isMounted()) {
        this.setState({
          open: true
        });
      }
      if (this.props.onFocus) {
        this.props.onFocus();
      }
    },

    handleBlur: function () {
      if (this.isMounted()) {
        this.saveTransientValue();
        this.setState({
          open: false
        });
      }
      if (this.props.onBlur) {
        this.props.onBlur();
      }
    },

    saveTransientValue: function () {
      var mt = this.parseStringToMoment(this.state.transientValue);
      if (mt === null) {
        this.props.onChange(null);
        this.setState({
          transientValue: "",
          transientMoment: null
        });
      } else {
        this.props.onChange(mt.format(this.props.saveFormat));
        this.setState({
          transientValue: mt.format(this.props.displayFormat),
          transientMoment: mt
        });
      }
    },

    handleChange: function (e) {
      if (this.isMounted()) {
        this.setState({
          transientValue: e.target.value
        });
      }
    },

    handleKeyDown: function (e) {
      switch (e.keyCode) {
        case KEY_ENTER:
          e.preventDefault();
          this.saveTransientValue();
          break;
        case KEY_N:
        case KEY_T:
          e.preventDefault();
          if (this.isMounted()) {
            var m = moment();
            this.setState({
              transientValue: m.format(this.props.displayFormat),
              transientMoment: m
            });
          }
          break;
      }
    },

    getInput: function () {
      return React.DOM.input(_.extend({}, this.props, {
        key: "input",
        type: "text",
        value: this.state.transientValue,
        onFocus: _.bind(this.handleFocus, this),
        onBlur: _.bind(this.handleBlur, this),
        onChange: _.bind(this.handleChange, this),
        onKeyDown: _.bind(this.handleKeyDown, this)
      }));
    },

    componentWillReceiveProps: function (nextProps) {
      var mt = this.parseStringToMoment(nextProps.value);
      if (this.isMounted()) {
        this.setState({
          transientValue: (mt === null) ? "" : mt.format(this.props.displayFormat),
          transientMoment: mt
        });
      }
    },

    doNothing: function (e) {
      e.preventDefault();
    },

    setDefault: function () {
      if (!this.isMounted()) {
        return;
      }
      var mt = moment();
      mt.hours(0);
      mt.minutes(0);
      this.setState({
        transientMoment: mt,
        transientValue: mt.format(this.props.displayFormat)
      });
    },

    moveHour: function (by) {
      if (this.state.transientMoment === null) {
        this.setDefault();
        return;
      }
      if (this.isMounted()) {
        var mt = moment(this.state.transientMoment);
        mt.hours(this.state.transientMoment.hours() + by);
        this.setState({
          transientMoment: mt,
          transientValue: mt.format(this.props.displayFormat)
        });
      }
    },

    moveMinute: function (by) {
      if (this.state.transientMoment === null) {
        this.setDefault();
        return;
      }
      if (this.isMounted()) {
        var mt = moment(this.state.transientMoment);
        var mins = Math.floor(((this.state.transientMoment.minutes() + by)) / 15) * 15;
        //while (mins < 0) {
        //  mins += 60;
        //}
        mt.minutes(mins);
        this.setState({
          transientMoment: mt,
          transientValue: mt.format(this.props.displayFormat)
        });
      }
    },

    getTimePicker: function () {
      // not yet implemented, always return null
      if (!this.state.open) {
        return null;
      }

      var mt = this.state.transientMoment;

      return React.DOM.div({ key: "tp", className: "timepicker", onMouseDown: this.doNothing }, [
        React.DOM.div({ key: "tub", className: "row timepicker-buttons" }, [
          React.DOM.div({
            key: "hu",
            className: "col-xs-4 text-center",
            onClick: _.bind(this.moveHour, this, 1)
          }, icon({ name: "chevron-up" })),
          React.DOM.div({
            key: "mu",
            className: "col-xs-4 text-center",
            onClick: _.bind(this.moveMinute, this, 15)
          }, icon({ name: "chevron-up" })),
          React.DOM.div({
            key: "pu",
            className: "col-xs-4 text-center",
            onClick: _.bind(this.moveHour, this, 12)
          }, icon({ name: "chevron-up" }))
        ]),
        React.DOM.div({ key: "ti", className: "row timepicker-inputs" }, [
          React.DOM.div({ key: "h", className: "col-xs-4" }, React.DOM.input({
            value: (mt !== null) ? mt.format("h") : "",
            readOnly: true,
            className: "form-control text-center"
          })),
          React.DOM.div({ key: "m", className: "col-xs-4" }, React.DOM.input({
            value: (mt !== null) ? mt.format("mm") : "",
            readOnly: true,
            className: "form-control text-center"
          })),
          React.DOM.div({ key: "a", className: "col-xs-4" }, React.DOM.input({
            value: (mt !== null) ? mt.format("A") : "",
            readOnly: true,
            className: "form-control text-center"
          }))
        ]),
        React.DOM.div({ key: "tdb", className: "row timepicker-buttons" }, [
          React.DOM.div({
            key: "hd",
            className: "col-xs-4 text-center",
            onClick: _.bind(this.moveHour, this, -1)
          }, icon({ name: "chevron-down" })),
          React.DOM.div({
            key: "md",
            className: "col-xs-4 text-center",
            onClick: _.bind(this.moveMinute, this, -15)
          }, icon({ name: "chevron-down" })),
          React.DOM.div({
            key: "pd",
            className: "col-xs-4 text-center",
            onClick: _.bind(this.moveHour, this, -12)
          }, icon({ name: "chevron-down" }))
        ])
      ]);
    },

    render: function () {
      if (Modernizr.inputtypes.time && this.props.polyfillOnly) {
        return React.DOM.input(_.extend({}, this.props, {
          type: "time"
        }));
      }

      return React.DOM.div({
        className: "timepicker-container"
      }, [
        this.getInput(),
        this.getTimePicker()
      ]);
    }
  });
});
