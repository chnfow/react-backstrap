/**
 * React Component
 */
define([ "react", "underscore", "../mixins/Attribute", "moment", "../layout/Icon" ],
  function (React, _, attribute, moment, icon) {
    "use strict";

    var supportsDate = _.supportInput("date") && false;

    var MONTHS = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    var DAYS = [ "Su", "Mo", "Tu", "We", "Tr", "Sa" ];

    return _.rf({
      displayName: "Attribute DatePicker",

      mixins: [ attribute ],

      propTypes: {
        multiplierDelay: React.PropTypes.number,
        min: React.PropTypes.instanceOf(Date),
        max: React.PropTypes.instanceOf(Date),
        maxMultiplier: React.PropTypes.number
      },

      getDefaultProps: function () {
        return {
          multiplierDelay: 200,
          maxMultiplier: 32,
          min: new Date(1900, 1, 1),
          max: new Date(2200, 1, 1)
        };
      },

      getInitialState: function () {
        var d = new Date();
        return {
          open: false,
          currentMonth: d.getMonth(),
          currentYear: d.getFullYear(),
          multiplier: 1,
          resetTimer: null
        };
      },

      openDatePicker: function () {
        if (this.isMounted() && !this.props.disabled) {
          var selectedValue = false;
          var selectedYear = null;
          var selectedMonth = null;
          if (this.props.model.has(this.props.attribute)) {
            var currentDate = moment.utc(this.props.model.get(this.props.attribute), "YYYY-MM-DD");
            if (currentDate.isValid()) {
              selectedMonth = currentDate.month();
              selectedYear = currentDate.year();
              selectedValue = true;
            }
          }
          if (!selectedValue) {
            var now = new Date();
            selectedYear = now.getFullYear();
            selectedMonth = now.getMonth();
          }

          this.setState({
            open: true,
            currentMonth: selectedMonth,
            currentYear: selectedYear
          });
        }
      },

      closeDatePicker: function () {
        if (this.isMounted()) {
          this.setState({
            open: false
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
          }, [
            React.DOM.span({ key: "Su" }, "Su"),
            React.DOM.span({ key: "Mo" }, "Mo"),
            React.DOM.span({ key: "Tu" }, "Tu"),
            React.DOM.span({ key: "We" }, "We"),
            React.DOM.span({ key: "Tr" }, "Tr"),
            React.DOM.span({ key: "Fr" }, "Fr"),
            React.DOM.span({ key: "Sa" }, "Sa")
          ])
        ]);
      },

      moveMonth: function (byValue, e) {
        this.doNothing(e);
        var month = this.state.currentMonth + (byValue * Math.min(this.state.multiplier, this.props.maxMultiplier));
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
            currentYear: year,
            multiplier: this.state.multiplier * 2
          });
          this.restartMultiplier();
        }
      },

      restartMultiplier: function () {
        if (this.state.resetTimer !== null) {
          clearTimeout(this.state.resetTimer);
        }
        this.setState({
          resetTimer: setTimeout(_.bind(function () {
            if (this.isMounted()) {
              this.setState({
                multiplier: 1,
                resetTimer: null
              });
            }
          }, this), this.props.multiplierDelay)
        });
      },

      componentWillUnmount: function () {
        if (this.state.resetTimer) {
          clearTimeout(this.state.resetTimer);
        }
      },

      getBody: function () {
        var days = [];

        var selectedDay = null;
        var selectedYear = null;
        var selectedMonth = null;
        if (this.props.model.has(this.props.attribute)) {
          var currentDate = moment.utc(this.props.model.get(this.props.attribute), "YYYY-MM-DD");
          if (currentDate.isValid()) {
            selectedDay = currentDate.date();
            selectedMonth = currentDate.month();
            selectedYear = currentDate.year();
          }
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
          days.push(React.DOM.span({
            key: "filler-" + firstDayOfMonth,
            className: "concurrent-month-days" + ((isActive) ? " bg-info" : ""),
            onClick: _.bind(this.setDate, this, lastYear, lastMonth, d)
          }, d));
        }
        var numDays = _.numDays(this.state.currentMonth, this.state.currentYear);
        for (var x = 1; x <= numDays; x++) {
          isActive = (this.state.currentYear === selectedYear && this.state.currentMonth === selectedMonth && x === selectedDay);
          days.push(React.DOM.span({
            key: "day-" + x,
            className: (isActive ? "bg-info" : ""),
            onMouseDown: _.bind(this.setDate, this, this.state.currentYear, this.state.currentMonth, x)
          }, x));
        }

        var remainingDays = (Math.ceil(days.length / 7) * 7) - days.length;
        var nextMonthDay = 1;
        while (remainingDays > 0) {
          remainingDays--;
          var nmd = nextMonthDay++;
          isActive = (nextYear === selectedYear && nextMonth === selectedMonth && nmd === selectedDay);
          days.push(React.DOM.span({
            key: "filler-next-" + nmd,
            className: "concurrent-month-days" + ((isActive) ? " bg-info" : ""),
            onClick: _.bind(this.setDate, this, nextYear, nextMonth, nmd)
          }, nmd));
        }

        return React.DOM.div({
          className: "datepicker-calendar-body",
          key: "calendarbody"
        }, days);
      },

      setDate: function (year, month, day) {
        var m = moment(new Date(year, month, day));
        this.props.model.set(this.props.attribute, m.format("YYYY-MM-DD"));
        if (this.isMounted() && this.state.currentYear !== year || this.state.currentMonth !== month) {
          this.setState({
            currentYear: year,
            currentMonth: month
          });
        }
      },

      doNothing: function (e) {
        e.preventDefault();
        e.stopPropagation();
      },

      render: function () {
        if (supportsDate) {
          return React.DOM.input(_.extend({}, this.props, {
            type: "date",
            value: this.getValue(),
            onChange: this.saveData,
            name: this.props.attribute
          }));
        }

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

        var currentValue = this.getValue();
        if (typeof currentValue === "string" && currentValue.length) {
          currentValue = moment.utc(currentValue, [ "YYYY-MM-DD" ]).format("MM/DD/YYYY");
        } else {
          currentValue = null;
        }
        return React.DOM.div({
          className: "datepicker-container"
        }, [
          React.DOM.input(_.extend({}, this.props, {
            key: "input",
            type: "text",
            readOnly: (!this.props.disabled),
            value: currentValue,
            name: this.props.attribute,
            onChange: this.doNothing,
            onFocus: this.openDatePicker,
            onBlur: this.closeDatePicker
          })),
          datepicker
        ]);
      }
    });
  });