/**
 * React Component
 */
define([ "react", "underscore", "modernizr", "moment" ], function (React, _, Modernizr, moment) {
  "use strict";

  var KEY_ENTER = 13;

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
        allowedFormats: [ "HH:MM", "H:MM", "hh:mma", "h:mma", "hh:mmA", "h:mmA", "hh:mm A", "h:mm A" ],
        saveFormat: [ "HH:MM" ],
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
        transientValue: ""
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
      } else {
        this.props.onChange(mt.format(this.props.saveFormat));
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
      if (e.keyCode === KEY_ENTER) {
        e.preventDefault();
        this.saveTransientValue();
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
        keyDown: _.bind(this.handleKeyDown, this)
      }));
    },

    componentWillReceiveProps: function (nextProps) {
      var mt = this.parseStringToMoment(nextProps);
      if (this.isMounted()) {
        this.setState({
          transientValue: (mt === null) ? "" : mt.format(this.props.displayFormat)
        });
      }
    },

    getTimePicker: function () {
      if (!this.state.open) {
        return null;
      }

      return React.DOM.div({ key: "tp", className: "timepicker-container" }, []);
    },

    render: function () {
      if (Modernizr.inputtypes.time && this.props.polyfillOnly) {
        return React.DOM.input(_.extend({}, this.props, {
          type: "time"
        }));
      }

      return React.DOM.div({
        className: "time-picker"
      }, [
        this.getInput(),
        this.getTimePicker()
      ]);
    }
  });
});