define(["react", "underscore", "jquery", "../mixins/Attribute", "../mixins/Collection", "../controls/DynamicInput"],
  function (React, _, $, attribute, collection, dynamicInput) {

    "use strict";

    var funcOrAttributes = React.PropTypes.oneOfType([
      React.PropTypes.func,
      React.PropTypes.string,
      React.PropTypes.arrayOf(React.PropTypes.string)
    ]);

    var funcOrAttribute = React.PropTypes.oneOfType([
      React.PropTypes.func,
      React.PropTypes.string
    ]);

    var KEY_DOWN = 40;
    var KEY_UP = 38;
    var KEY_ENTER = 13;
    var KEY_BACKSPACE = 8;
    var KEY_LEFT = 37;
    var KEY_RIGHT = 39;
    var KEY_ESCAPE = 27;
    var KEY_PAGE_UP = 33;
    var KEY_PAGE_DOWN = 34;
    var KEY_HOME = 36;
    var KEY_END = 35;
    var KEY_DELETE = 46;


    return _.rf({

      mixins: [attribute, collection],

      propTypes: {
        valueAttirbute: React.PropTypes.string,
        multiple: React.PropTypes.bool,
        // what aspect of the model do we search on
        searchOn: funcOrAttributes,
        // how we would like to group the results
        groupBy: funcOrAttribute,
        // how to get the label of a group
        getGroupLabel: React.PropTypes.func,
        // whether to close after selecting a value in a multi-select input
        closeOnSelect: React.PropTypes.bool
      },

      getDefaultProps: function () {
        return {
          valueAttribute: "id",
          placeholder: "Select...",
          multiple: false,
          // search on the text attribute of the model
          searchOn: "name",
          // by default the label of a group is the group value
          getGroupLabel: function (groupVal) {
            return groupVal;
          },
          closeOnSelect: false
        };
      },

      getGroupOf: function (model) {
        if (typeof this.props.groupBy === "string") {
          return model.get(this.props.groupBy);
        } else if (typeof this.props.groupBy === "function") {
          return this.props.groupBy.call(this, model);
        }
        return null;
      },

      getInitialState: function () {
        return {
          // currently typed search text
          searchText: "",
          // where the cursor is placed in the input (between which selected elements)
          cursorPosition: 0,
          // which option is hilited
          hilite: 0,
          // the current search results
          results: [],
          // whether the dropdown is open (forced to match the input focus status)
          open: false
        };
      },

      // enforce that the component is focused if open, and blurred if closed
      componentDidUpdate: function () {
        if (this.state.open) {
          this.refs.search.focus();
        }
      },

      shouldComponentUpdate: function (nextProps, nextState) {
        // if just the hilite changes, let the set hilite method take care of it
        return (!_.isEqual(
          _.omit(this.state, "hilite"),
          _.omit(nextState, "hilite")
        ));
      },

      doSearch: function (e) {
        var q = e.target.value;
        var results = this.getResults(q);
        var hilite = Math.max(0, Math.min(this.state.hilite, results.length - 1));
        this.setState({
          searchText: q,
          results: results,
          hilite: hilite,
          cursorPosition: 0
        });
      },

      // this returns an array of models for which the getSearchValues function returns a value that includes the
      // search parameter q
      getResults: function (q) {
        q = (typeof q === "undefined") ? this.state.searchText : q;

        var selectedVals = this.getValue();
        // get an array of current values
        if (typeof selectedVals === "undefined" || selectedVals === null) {
          selectedVals = [];
        } else {
          if (!_.isArray(selectedVals)) {
            selectedVals = [selectedVals];
          }
        }

        var svf = this.getSearchValueFunction();

        return this.props.collection.filter(function (oneModel) {
          // val is already selected
          if (_.contains(selectedVals, oneModel.get(this.props.valueAttribute))) {
            return false;
          }
          // no search text entered
          if (q.length === 0) {
            return true;
          }
          var values = svf(oneModel);
          return _.some(values, function (oneValue) {
            if (typeof oneValue !== "string" || oneValue.length === 0) {
              return false;
            }
            return oneValue.toUpperCase().indexOf(q.toUpperCase()) !== -1;
          });
        }, this);
      },

      // for performance reasons, get a function to use to collect search values from a model
      getSearchValueFunction: function () {
        var toReturn;
        switch (typeof this.props.searchOn) {
          case "function":
            toReturn = _.bind(this.props.searchOn, this);
            break;
          case "string":
            var attr = this.props.searchOn;
            toReturn = function (model) {
              return model.get(attr);
            };
            break;
          case "object":
            var attrs = this.props.searchOn;
            toReturn = function (model) {
              return _.map(attrs, function (oneAttr) {
                return model.get(oneAttr);
              });
            };
            break;
        }
        return toReturn;
      },

      setHilite: function (hilite) {
        hilite = Math.max(Math.min(hilite, this.state.results.length - 1), 0);
        if (hilite === this.state.hilite) {
          return;
        }
        // component won't update if just the hilite changes, so we should do the hiliting here in case it doesn't update
        $(this.refs["result-" + this.state.hilite].getDOMNode()).removeClass("hilited");
        $(this.refs["result-" + hilite].getDOMNode()).addClass("hilited");
        this.setState({hilite: hilite}, this.scrollHiliteIntoView);
      },

      // make sure whatever is hilited is scrolled into view for the results div
      scrollHiliteIntoView: function () {
        var dropdownNode = this.refs.results.getDOMNode();
        var hilitedNode = this.refs["result-" + this.state.hilite].getDOMNode();
        var resultsTop = dropdownNode.scrollTop;
        var hiliteTop = hilitedNode.offsetTop;
        if (resultsTop > hiliteTop) {
          dropdownNode.scrollTop = hiliteTop;
        } else {
          var resultsBottom = dropdownNode.scrollTop + dropdownNode.offsetHeight;
          var hiliteBottom = hilitedNode.offsetTop + hilitedNode.offsetHeight;
          if (resultsBottom < hiliteBottom) {
            dropdownNode.scrollTop = hiliteBottom - dropdownNode.offsetHeight;
          }
        }
      },

      setCursorPosition: function (cp) {
        var value = this.getValue();
        if (!_.isArray(value)) {
          cp = 0;
        } else {
          cp = Math.max(Math.min(value.length, cp), 0);
        }
        if (cp === this.state.cursorPosition) {
          return;
        }
        this.setState({
          cursorPosition: cp
        });
      },

      handleKeydown: function (e) {
        switch (e.keyCode) {
          //handle key navigation of the result list
          case KEY_DOWN:
            e.preventDefault();
            this.setHilite(this.state.hilite + 1);
            break;
          case KEY_UP:
            e.preventDefault();
            this.setHilite(this.state.hilite - 1);
            break;
          case KEY_PAGE_UP:
            e.preventDefault();
            this.setHilite(this.state.hilite - 10);
            break;
          case KEY_PAGE_DOWN:
            e.preventDefault();
            this.setHilite(this.state.hilite + 10);
            break;
          case KEY_END:
            e.preventDefault();
            this.setHilite(this.state.results.length - 1);
            break;
          case KEY_HOME:
            e.preventDefault();
            this.setHilite(0);
            break;
          case KEY_ESCAPE:
            this.refs.search.blur();
            break;
          // handle key selection of a result
          case KEY_ENTER:
            this.selectResult(this.state.hilite, e);
            break;
          case KEY_LEFT:
            if (this.state.searchText.length > 0) {
              return;
            }
            this.setCursorPosition(this.state.cursorPosition + 1);
            break;
          case KEY_RIGHT:
            if (this.state.searchText.length > 0) {
              return;
            }
            this.setCursorPosition(this.state.cursorPosition - 1);
            break;
          case KEY_BACKSPACE:
            if (this.state.searchText.length > 0) {
              return;
            }
            this.removeSelectedItemAt(this.state.cursorPosition + 1);
            break;
          case KEY_DELETE:
            if (this.state.searchText.length > 0) {
              return;
            }
            this.removeSelectedItemAt(this.state.cursorPosition);
            break;
        }
      },

      removeSelectedItemAt: function (countFromLast) {
        if (typeof countFromLast !== "number" || !this.props.multiple) {
          this.props.model.unset(this.props.attribute);
          return;
        }
        var currentValue = this.getValue();
        if (this.props.multiple && !_.isArray(currentValue)) {
          return;
        }
        var realIndex = currentValue.length - countFromLast;
        if (currentValue.length <= realIndex || realIndex < 0) {
          return;
        }
        var newValue = _.clone(currentValue);
        newValue.splice(realIndex, 1);
        this.props.model.set(this.props.attribute, newValue);
        this.setState({
          cursorPosition: this.state.cursorPosition - 1
        });
      },

      openResults: function () {
        this.setState({
          open: true,
          results: this.getResults(this.state.searchText),
          cursorPosition: 0
        });
      },

      closeResults: function () {
        this.setState({
          open: false,
          searchText: ""
        });
      },

      selectResult: function (resultIndex, e) {
        e.preventDefault();
        e.stopPropagation();
        var selectedModel = this.state.results[resultIndex];
        // should never happen
        if (!selectedModel) {
          return;
        }
        var modelVal = selectedModel.get(this.props.valueAttribute);
        if (!this.props.multiple) {
          this.props.model.set(this.props.attribute, modelVal);
        } else {
          var currentValue = this.getValue();
          var newValue = [modelVal];
          if (_.isArray(currentValue)) {
            newValue = currentValue.concat(newValue);
          }
          this.props.model.set(this.props.attribute, newValue);
        }
        if (!this.props.multiple || this.props.closeOnSelect) {
          this.refs.search.blur();
        }
        var newResults = this.getResults("");
        var open = true;
        if (!this.props.multiple || this.props.closeOnSelect) {
          open = false;
        }
        this.setState({
          results: newResults,
          searchText: "",
          open: open,
          hilite: Math.min(this.state.hilite, newResults.length)
        });
      },

      // handle a click of the select field
      handleSelectClick: function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
          open: true
        });
      },

      getDisplayItem: function (className, model) {
        return React.DOM.span({
          className: className
        }, this.getSingleComponentView(model));
      },

      findModelByValue: function (value) {
        var findObj = {};
        findObj[this.props.valueAttribute] = value;
        return this.props.collection.findWhere(findObj);
      },

      render: function () {
        var children = [];

        // get the value
        var currentValue = this.getValue();
        var selectedItems = [];
        if (!this.props.multiple) {
          if (this.state.searchText.length === 0) {
            var model = this.findModelByValue(currentValue);
            if (model) {
              selectedItems = [this.getDisplayItem("fancy-select-single-choice", model)];
            }
          }
        } else {
          if (_.isArray(currentValue)) {
            var selectedModels = _.filter(_.map(currentValue, this.findModelByValue, this), Boolean);
            selectedItems = _.map(selectedModels, _.bind(this.getDisplayItem, this, "fancy-select-multiple-choice"));
          }
        }

        //only display the placeholder if there is no value selected
        var placeholder;
        if (this.props.placeholder) {
          if (this.props.multiple) {
            if (!_.isArray(currentValue) || currentValue.length === 0) {
              placeholder = this.props.placeholder;
            }
          } else {
            if (!currentValue || currentValue === "") {
              placeholder = this.props.placeholder;
            }
          }
        }

        var insideInput;
        var typingArea = dynamicInput({
          className: "fancy-select-type-area",
          id: this.props.id,
          ref: "search",
          key: "search",
          onChange: this.doSearch,
          onKeyDown: this.handleKeydown,
          onFocus: this.openResults,
          onBlur: this.closeResults,
          value: this.state.searchText,
          placeholder: placeholder
        });
        if (!this.props.multiple) {
          insideInput = [selectedItems, typingArea];
        } else {
          var position = selectedItems.length - this.state.cursorPosition;
          selectedItems.splice(position, 0, typingArea);
          insideInput = selectedItems;
        }

        // show a caret to indicate whether the input is open
        insideInput.push(React.DOM.span({
          className: "caret"
        }));

        var openClassName = "";
        if (this.state.open) {
          openClassName = "dropup";
        }

        var fakeInputProps = _.omit(_.extend({}, this.props, {
          onMouseDown: this.handleSelectClick,
          className: "fancy-select-fake-input " + openClassName + " " + (this.props.className || "")
        }), "id");
        // fake input is a div that contains the real input plus the selected items
        var fakeInput = React.DOM.div(fakeInputProps, insideInput);
        children.push(fakeInput);

        if (this.state.open) {
          var i = 0;
          // take the models and turn them into model components, then wrap each one in a autocomplete-search-result div
          var results = _.map(this.getModels(this.state.results), function (oneResultComponent) {
            var myIndex = i++;
            var optionClass = "fancy-select-search-result";
            if (myIndex === this.state.hilite) {
              optionClass += " hilited";
            }
            return React.DOM.div({
              className: optionClass,
              ref: "result-" + myIndex,
              onMouseOver: _.bind(this.setHilite, this, myIndex),
              onMouseDown: _.bind(this.selectResult, this, myIndex)
            }, oneResultComponent);
          }, this);
          // put all the results in an absolutely positioned div under the search box
          var searchResults = React.DOM.div({
            className: "fancy-select-search-results",
            ref: "results"
          }, results);
          children.push(searchResults);
        }

        return React.DOM.div({
          className: "fancy-select-container",
          ref: "container"
        }, children);
      }

    });
  });