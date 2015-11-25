/**
 * React Component
 */
define([ "react", "underscore", "modernizr", "moment", "../layout/Icon", "util" ], function (React, _, Modernizr, moment, icon, util) {
  "use strict";

  var KEY_ENTER = 13;
  var KEY_N = 78;
  var KEY_T = 84;

  var rpt = React.PropTypes;
  var d = React.DOM;


  return util.rf({
    displayName: "Time Input",

    propTypes: {
      onChange: rpt.func.isRequired,
      value: rpt.string,
      allowedFormats: rpt.arrayOf(rpt.string),
      saveFormat: rpt.string,
      displayFormat: rpt.string,
      polyfillOnly: rpt.bool
    },

    mixins: [ React.addons.PureRenderMixin ],

    getDefaultProps: function () {
      return {
        allowedFormats: [ "HH:mm", "H:mm", "hh:mma", "h:mma", "hh:mmA", "h:mmA", "hh:mm A", "h:mm A" ],
        saveFormat: "HH:mm",
        displayFormat: "h:mm A",
        polyfillOnly: false,
        meridiemPlaceholder: "XM",
        hourPlaceholder: "HH",
        minutePlaceholder: "MM"
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
      return d.input(_.omit(_.extend({}, this.props, {
        key: "input",
        type: "text",
        value: this.state.transientValue,
        onFocus: _.bind(this.handleFocus, this),
        onBlur: _.bind(this.handleBlur, this),
        onChange: _.bind(this.handleChange, this),
        onKeyDown: _.bind(this.handleKeyDown, this)
      }), "children"));
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

      return d.div({ key: "tp", className: "timepicker", onMouseDown: this.doNothing }, [
        d.div({ key: "tub", className: "row timepicker-buttons" }, [
          d.div({
            key: "hu",
            className: "col-xs-4 text-center",
            onClick: _.bind(this.moveHour, this, 1)
          }, icon({ name: "chevron-up" })),
          d.div({
            key: "mu",
            className: "col-xs-4 text-center",
            onClick: _.bind(this.moveMinute, this, 15)
          }, icon({ name: "chevron-up" })),
          d.div({
            key: "pu",
            className: "col-xs-4 text-center",
            onClick: _.bind(this.moveHour, this, 12)
          }, icon({ name: "chevron-up" }))
        ]),
        d.div({ key: "ti", className: "row timepicker-inputs" }, [
          d.div({ key: "h", className: "col-xs-4" }, d.input({
            value: (mt !== null) ? mt.format("h") : "",
            readOnly: true,
            placeholder: this.props.hourPlaceholder,
            className: "form-control text-center"
          })),
          d.div({ key: "m", className: "col-xs-4" }, d.input({
            value: (mt !== null) ? mt.format("mm") : "",
            placeholder: this.props.minutePlaceholder,
            readOnly: true,
            className: "form-control text-center"
          })),
          d.div({ key: "a", className: "col-xs-4" }, d.input({
            value: (mt !== null) ? mt.format("A") : "",
            placeholder: this.props.meridiemPlaceholder,
            readOnly: true,
            className: "form-control text-center"
          }))
        ]),
        d.div({ key: "tdb", className: "row timepicker-buttons" }, [
          d.div({
            key: "hd",
            className: "col-xs-4 text-center",
            onClick: _.bind(this.moveHour, this, -1)
          }, icon({ name: "chevron-down" })),
          d.div({
            key: "md",
            className: "col-xs-4 text-center",
            onClick: _.bind(this.moveMinute, this, -15)
          }, icon({ name: "chevron-down" })),
          d.div({
            key: "pd",
            className: "col-xs-4 text-center",
            onClick: _.bind(this.moveHour, this, -12)
          }, icon({ name: "chevron-down" }))
        ])
      ]);
    },

    render: function () {
      if (Modernizr.inputtypes.time && this.props.polyfillOnly) {
        return d.input(_.extend({}, this.props, {
          type: "time"
        }));
      }

      return d.div({
        className: "timepicker-container"
      }, [
        this.getInput(),
        this.getTimePicker()
      ]);
    }
  });
});
