/**
 * A controlled input that calls onChange(saveFormat formatted date) when a user selects a date, and takes
 * value: saveFormat for the currently selected value
 */
define([ "react", "underscore", "moment", "../layout/Icon" ],
  function (React, _, moment, icon) {
    "use strict";

    var MONTHS = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    var DAYS = [ "Su", "Mo", "Tu", "We", "Tr", "Fr", "Sa" ];

    var KEY_ENTER = 13;

    return _.rf({
      displayName: "Datepicker Input",

      mixins: [ React.addons.PureRenderMixin ],

      propTypes: {
        onChange: React.PropTypes.func.isRequired,
        value: React.PropTypes.string,
        min: React.PropTypes.instanceOf(Date),
        max: React.PropTypes.instanceOf(Date),
        allowedFormats: React.PropTypes.arrayOf(React.PropTypes.string),
        saveFormat: React.PropTypes.string,
        displayFormat: React.PropTypes.string
      },

      getDefaultProps: function () {
        return {
          min: new Date(1900, 0, 1),
          max: new Date(2200, 0, 1),
          allowedFormats: [ "YYYY/MM/DD", "YYYY-MM-DD", "MM/DD/YYYY", "MM-DD-YYYY", "M/D/YY", "M-D-YY", "M/D/YYYY", "M-D-YYYY" ],
          saveFormat: "YYYY-MM-DD",
          displayFormat: "MM/DD/YYYY"
        };
      },

      getInitialState: function () {
        var d = new Date();
        return {
          open: false,
          currentMonth: d.getMonth(),
          currentYear: d.getFullYear(),
          // this value stores the value of the input while it's focused
          transientValue: null
        };
      },

      openDatePicker: function () {
        if (!this.isMounted() || this.props.disabled) {
          return;
        }
        var selectedYear = null;
        var selectedMonth = null;
        var cv = this.getCurrentValueAsMoment();
        if (cv !== null) {
          selectedMonth = cv.month();
          selectedYear = cv.year();
        } else {
          var now = new Date();
          // set the selected year and month to be within the bounds of the range
          if (now.getTime() < this.props.min.getTime()) {
            now = new Date(this.props.min.getTime());
          }
          if (now.getTime() > this.props.max.getTime()) {
            now = new Date(this.props.max.getTime());
          }
          selectedYear = now.getFullYear();
          selectedMonth = now.getMonth();
        }

        var startValue = (cv !== null) ? cv.format(this.props.displayFormat) : "";

        this.setState({
          open: true,
          currentMonth: selectedMonth,
          currentYear: selectedYear,
          transientValue: startValue
        });
      },

      parseTransientValueToMoment: function () {
        var textValue = this.state.transientValue;
        var valueMoment = moment.utc(textValue, this.props.allowedFormats, true);
        if (valueMoment.isValid()) {
          var min = moment.utc(this.props.min);
          var max = moment.utc(this.props.max);
          if (min.isAfter(valueMoment)) {
            valueMoment = min;
          }
          if (max.isBefore(valueMoment)) {
            valueMoment = max;
          }
          return valueMoment;
        } else {
          return null;
        }
      },

      saveTransientValue: function () {
        var val = this.parseTransientValueToMoment();
        if (val !== null) {
          this.props.onChange(val.format(this.props.saveFormat));
        } else {
          this.props.onChange(null);
        }
      },

      closeDatePicker: function () {
        if (this.isMounted()) {
          this.saveTransientValue();
          // set the date based on the transient value
          this.setState({
            open: false,
            transientValue: null
          });
        }
      },

      getHeader: function () {
        return React.DOM.div({
          key: "datepickerheader",
          className: "datepicker-header"
        }, [
          React.DOM.div({
            key: "prev",
            onMouseDown: _.bind(this.moveMonth, this, -1),
            className: "datepicker-header-prev"
          }, icon({
            name: "chevron-left"
          })),
          React.DOM.div({
            key: "header-label",
            className: "datepicker-header-label"
          }, MONTHS[ this.state.currentMonth ] + " " + this.state.currentYear),
          React.DOM.div({
            key: "next",
            onMouseDown: _.bind(this.moveMonth, this, 1),
            className: "datepicker-header-next"
          }, icon({
            name: "chevron-right"
          })),
          React.DOM.div({
            key: "day-labels",
            className: "datepicker-header-days"
          }, _.map(DAYS, function (oneDay) {
            return React.DOM.span({ key: oneDay }, oneDay);
          }))
        ]);
      },

      // handle clicking the next and previous buttons
      moveMonth: function (byValue, e) {
        this.doNothing(e);
        var month = this.state.currentMonth + byValue;
        var year = this.state.currentYear;
        if (month < 0) {
          while (month < 0) {
            month += 12;
            year--;
          }
        }
        if (month > 11) {
          while (month > 11) {
            month -= 12;
            year++;
          }
        }
        if (this.isMounted()) {
          this.setState({
            currentMonth: month,
            currentYear: year
          });
        }
      },

      getBody: function () {
        var days = [];

        var selectedDay = null;
        var selectedYear = null;
        var selectedMonth = null;
        var currentDate = this.getCurrentValueAsMoment();
        if (currentDate !== null) {
          selectedDay = currentDate.date();
          selectedMonth = currentDate.month();
          selectedYear = currentDate.year();
        }

        // 0 is sunday, 6 is monday
        var firstDayOfMonth = (new Date(this.state.currentYear, this.state.currentMonth)).getDay();
        var lastMonth = this.state.currentMonth - 1;
        var nextMonth = this.state.currentMonth + 1;
        var lastYear = this.state.currentYear;
        var nextYear = this.state.currentYear;
        if (lastMonth < 0) {
          lastMonth += 12;
          lastYear--;
        }
        if (nextMonth > 11) {
          nextMonth -= 12;
          nextYear++;
        }
        var isActive;
        var lastMonthDays = _.numDays(lastMonth, lastYear);
        while (firstDayOfMonth > 0) {
          var d = lastMonthDays - (--firstDayOfMonth);
          isActive = (lastYear === selectedYear && lastMonth === selectedMonth && d === selectedDay);
          days.push(this.getDaySpan(lastYear, lastMonth, d, isActive));
        }
        var numDays = _.numDays(this.state.currentMonth, this.state.currentYear);
        for (var x = 1; x <= numDays; x++) {
          isActive = (this.state.currentYear === selectedYear && this.state.currentMonth === selectedMonth && x === selectedDay);
          days.push(this.getDaySpan(this.state.currentYear, this.state.currentMonth, x, isActive, true));
        }

        var remainingDays = (Math.ceil(days.length / 7) * 7) - days.length;
        var nextMonthDay = 1;
        while (remainingDays > 0) {
          remainingDays--;
          var nmd = nextMonthDay++;
          isActive = (nextYear === selectedYear && nextMonth === selectedMonth && nmd === selectedDay);
          days.push(this.getDaySpan(nextYear, nextMonth, nmd, isActive));
        }

        return React.DOM.div({
          className: "datepicker-calendar-body",
          key: "calendarbody"
        }, days);
      },

      getDaySpan: function (year, month, day, active, currentMonth) {
        var valid = this.validDate(year, month, day);
        var classes = [];
        if (!currentMonth) {
          classes.push("concurrent-month-days");
        }
        if (active) {
          classes.push("bg-info");
        }
        if (!valid) {
          classes.push("invalid-day-option");
        }
        return React.DOM.span({
          key: "calendar-day-" + year + "-" + month + "-" + day,
          className: classes.join(" "),
          onMouseDown: (valid) ? _.bind(this.setDate, this, year, month, day) : this.doNothing
        }, day);
      },

      // returns whether the year/month/day falls within the min and max dates
      validDate: function (year, month, day) {
        var min = this.props.min.getTime();
        var max = this.props.max.getTime();
        var t = (new Date(year, month, day)).getTime();
        return (t >= min && t <= max);
      },

      setDate: function (year, month, day, cp) {
        var m = moment(new Date(year, month, day));
        if (m.isAfter(this.props.max)) {
          m = moment(this.props.max);
          year = m.year();
          month = m.month();
        }
        if (m.isBefore(this.props.min)) {
          m = moment(this.props.min);
          year = m.year();
          month = m.month();
        }
        this.props.onChange(m.format(this.props.saveFormat));
        if (this.isMounted()) {
          this.setState({
            currentYear: year,
            currentMonth: month,
            transientValue: m.format(this.props.displayFormat)
          });
        }
      },

      doNothing: function (e) {
        e.preventDefault();
        e.stopPropagation();
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
          this.doNothing(e);
          var val = this.parseTransientValueToMoment();
          if (val !== null && this.isMounted()) {
            this.props.onChange(val.format(this.props.saveFormat));
            this.setState({
              transientValue: val.format(this.props.displayFormat),
              currentMonth: val.month(),
              currentYear: val.year()
            });
          }
        }
      },

      getCurrentValueAsMoment: function () {
        // get the current value as a moment
        var currentValue = this.props.value;
        if (typeof currentValue === "string" && currentValue.length > 0) {
          currentValue = moment.utc(currentValue, this.props.saveFormat, true);
          if (!currentValue.isValid()) {
            currentValue = null;
          }
        } else {
          currentValue = null;
        }
        return currentValue;
      },

      clearValue: function (e) {
        this.doNothing(e);
        this.props.onChange(null);
        this.setState({
          transientValue: null
        });
      },

      render: function () {
        var datepicker = null;
        if (this.state.open) {
          datepicker = React.DOM.div({
            key: "dp",
            className: "datepicker-calendar",
            onMouseDown: this.doNothing
          }, [
            this.getHeader(),
            this.getBody()
          ]);
        }

        var currentValue = this.getCurrentValueAsMoment();
        currentValue = currentValue === null ? null : currentValue.format(this.props.displayFormat);

        // the display value depends on whether the input is focused
        var displayValue = this.state.transientValue;
        if (displayValue === null) {
          displayValue = currentValue === null ? "" : currentValue;
        }

        // show clear button if there's a value
        var clearButton = null;
        if ((displayValue && displayValue.length > 0) && !this.props.disabled && !this.props.readOnly) {
          clearButton = React.DOM.div({
            key: "clear",
            className: "datepicker-clear-button",
            onMouseDown: this.clearValue
          }, icon({ name: "remove" }));
        }

        var className = "datepicker-container";
        return React.DOM.div({
          className: className
        }, [
          React.DOM.input(_.extend({}, this.props, {
            key: "input",
            type: "text",
            value: displayValue,
            onBlur: this.closeDatePicker,
            onChange: this.handleChange,
            onKeyDown: this.handleKeyDown,
            onFocus: this.openDatePicker,
            placeholder: this.props.placeholder || this.props.displayFormat
          })),
          datepicker,
          clearButton
        ]);
      }
    });
  });