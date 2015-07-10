/**
 * A highly controlled input that prevents the user from entering invalid dates and forces formatting of YYYY-MM-DD
 * on the attribute value.
 */
define([ "react", "underscore", "../mixins/Attribute", "moment", "../layout/Icon" ],
  function (React, _, attribute, moment, icon) {
    "use strict";

    var MONTHS = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    var DAYS = [ "Su", "Mo", "Tu", "We", "Tr", "Fr", "Sa" ];
    var KEY_BACKSPACE = 8;
    var KEY_UP = 38;
    var KEY_DOWN = 40;

    var KEY_ZERO = 48;
    var KEY_NINE = 57;

    return _.rf({
      displayName: "Attribute DatePicker",

      mixins: [ attribute, React.addons.PureRenderMixin ],

      propTypes: {
        min: React.PropTypes.instanceOf(Date),
        max: React.PropTypes.instanceOf(Date)
      },

      getDefaultProps: function () {
        return {
          min: new Date(1900, 0, 1),
          max: new Date(2200, 0, 1)
        };
      },

      getInitialState: function () {
        var d = new Date();
        return {
          open: false,
          currentMonth: d.getMonth(),
          currentYear: d.getFullYear(),
          cursorPosition: null
        };
      },

      componentDidUpdate: function () {
        if (this.state.cursorPosition !== null) {
          var cp = this.state.cursorPosition;
          this.setState({
            cursorPosition: null
          }, function () {
            // move the cursor to cursorPosition
            var input = React.findDOMNode(this.refs.input);
            if (input.setSelectionRange) {
              input.focus();
              input.setSelectionRange(cp, cp);
            } else if (input.createTextRange) {
              var range = input.createTextRange();
              range.collapse(true);
              range.moveEnd('character', cp);
              range.moveStart('character', cp);
              range.select();
            }
          });
        }
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
            // if the current date is not in the range, then we should choose one that is smack dab in the middle
            if (now.getTime() < this.props.min.getTime()) {
              now = new Date(this.props.min.getTime());
            }
            if (now.getTime() > this.props.max.getTime()) {
              now = new Date(this.props.max.getTime());
            }
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
          }, _.map(DAYS, function (oneDay) {
            return React.DOM.span({ key: oneDay }, oneDay);
          }))
        ]);
      },

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
        this.props.model.set(this.props.attribute, m.format("YYYY-MM-DD"));
        if (this.isMounted()) {
          this.setState({
            currentYear: year,
            currentMonth: month,
            cursorPosition: cp || this.getCursorPosition()
          });
        }
      },

      doNothing: function (e) {
        e.preventDefault();
        e.stopPropagation();
      },

      handleKeyDown: function (e) {
        // only react to up and down keys
        switch (e.keyCode) {
          case KEY_UP:
            this.doNothing(e);
            this.moveSelectionBy(1);
            break;
          case KEY_DOWN:
            this.doNothing(e);
            this.moveSelectionBy(-1);
            break;
          case KEY_BACKSPACE:
            this.doNothing(e);
            this.props.model.unset(this.props.attribute);
            break;
          default:
            if (e.keyCode >= KEY_ZERO && e.keyCode <= KEY_NINE) {
              this.doNothing(e);
              this.setCharacterAtCursorPosition(+(String.fromCharCode(e.keyCode)));
            }
            break;
        }
      },

      setCharacterAtCursorPosition: function (num) {
        var cv = this.getCurrentValueAsMoment();
        if (cv === null) {
          cv = moment(new Date((this.props.max.getTime() + this.props.min.getTime()) / 2));
          this.setDate(cv.year(), (num === 1) ? 9 : ((num === 0) ? 0 : (num - 1)), cv.date(), (num === 1 || num === 0) ? 1 : 3);
          return;
        }

        var cp = this.getCursorPosition();
        var dateValue = cv.format("MM/DD/YYYY");
        var pieces = dateValue.split("");

        var year = cv.year();
        var month = cv.month();
        var date = cv.date();

        var daysInMonth = _.numDays(month, year);

        switch (cp) {
          // cursor is on the first character
          case 0:
            if (num === 1 || num === 0) {
              month = Math.min(+(num.toString() + pieces[ 1 ]) - 1, 11);
              cp++;
            } else {
              month = num - 1;
              cp = 3;
            }
            break;
          case 1:
            month = Math.min(+(pieces[ 0 ] + num.toString()) - 1, 11);
            cp += 2;
            break;
          case 2:
          case 3:
            date = Math.max(1, Math.min((+(num.toString() + pieces[ 4 ])), daysInMonth));
            cp = 4;
            break;
          case 4:
            date = Math.max(1, Math.min((+(pieces[ 3 ] + num.toString())), daysInMonth));
            cp = 6;
            break;
          case 6:
            num = Math.max(Math.min(2, num), 1);
            if (num === 2 || num === 1) {
              year = +(num.toString() + pieces.slice(7, 10).join(""));
            }
            cp++;
            break;
          case 7:
            year = +(pieces[ 6 ] + num.toString() + pieces.slice(8, 10).join(""));
            cp++;
            break;
          case 8:
            year = +(pieces.slice(6, 8).join("") + num.toString() + pieces.slice(9, 10).join(""));
            cp++;
            break;
          case 9:
            year = +(pieces.slice(6, 9).join("") + num.toString());
            cp++;
            break;
        }
        this.setDate(year, month, date, cp);
      },

      getCurrentValueAsMoment: function () {
        // get the current value as a moment
        var currentValue = this.getValue();
        if (typeof currentValue === "string" && currentValue.length > 0) {
          currentValue = moment.utc(currentValue, "YYYY-MM-DD");
          if (!currentValue.isValid()) {
            currentValue = null;
          }
        } else {
          currentValue = null;
        }
        return currentValue;
      },

      moveSelectionBy: function (num) {
        var cv = this.getCurrentValueAsMoment();
        if (cv === null) {
          cv = moment();
          this.setDate(cv.year(), cv.month(), cv.date());
          return;
        }
        var year = cv.year();
        var month = cv.month();
        var day = cv.date();

        var cursorPosition = this.getCursorPosition();
        if (cursorPosition < 3) {
          // move the month, may need to increment the year
          month += num;
          if (month < 0) {
            year--;
            month += 12;
          }
          if (month > 11) {
            year++;
            month -= 12;
          }
          day = Math.min(day, _.numDays(month, year));
        } else if (cursorPosition < 6) {
          day += num;
          if (day > _.numDays(month, year)) {
            month++;
            day = 1;
          }
          if (day < 1) {
            month--;
            if (month < 0) {
              month += 12;
              year--;
            }
            day = _.numDays(month, year);
          }
          if (month > 11) {
            month -= 12;
            year++;
          }
        } else {
          // move the year, month will always be valid but day may not be
          year += num;
          day = Math.min(day, _.numDays(month, year));
        }
        this.setDate(year, month, day);
      },

      getCursorPosition: function () {
        if (!this.isMounted()) {
          return 0;
        }
        var input = React.findDOMNode(this.refs.input);
        if ('selectionStart' in input) {
          // Standard-compliant browsers
          return input.selectionStart;
        } else if (document.selection) {
          var sel = document.selection.createRange();
          var selLen = document.selection.createRange().text.length;
          sel.moveStart('character', -input.value.length);
          return sel.text.length - selLen;
        }
      },

      clearValue: function (e) {
        this.doNothing(e);
        this.props.model.unset(this.props.attribute);
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
        currentValue = currentValue === null ? null : currentValue.format("MM/DD/YYYY");

        // show clear button
        var clearButton = null;
        if (currentValue !== null && !this.props.disabled && !this.props.readOnly) {
          clearButton = React.DOM.div({
            key: "clear",
            className: "datepicker-clear-button",
            onMouseDown: this.clearValue
          }, icon({ name: "remove" }));
        }

        return React.DOM.div({
          className: "datepicker-container"
        }, [
          React.DOM.input(_.extend({}, this.props, {
            key: "input",
            ref: "input",
            type: "text",
            value: currentValue === null ? "" : currentValue,
            name: this.props.attribute,
            onBlur: this.closeDatePicker,
            onChange: this.doNothing,
            onFocus: this.openDatePicker,
            onKeyDown: this.handleKeyDown,
            placeholder: this.props.placeholder || "MM/DD/YYYY"
          })),
          datepicker,
          clearButton
        ]);
      }
    });
  });