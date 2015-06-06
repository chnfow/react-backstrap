define(["react", "underscore", "jquery", "../mixins/Attribute", "../mixins/Collection", "./Select", "../controls/DynamicInput"],
  function (React, _, $, attribute, collection, select, dynamicInput) {

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
        } else {
          this.refs.search.blur();
        }
      },

      doSearch: function (e) {
        var q = e.target.value;
        var results = this.getResults(q);
        var hilite = Math.max(0, Math.min(this.state.hilite, results.length - 1));
        this.setState({
          searchText: q,
          results: results,
          hilite: hilite
        });
      },

      // this returns an array of models for which the getSearchValues function returns a value that includes the
      // search parameter q
      getResults: function (q) {
        q = q || this.state.searchText;

        var selectedVals = this.getValue();
        // get an array of current values
        if (typeof selectedVals === "undefined" || selectedVals === null) {
          selectedVals = [];
        } else {
          if (!_.isArray(selectedVals)) {
            selectedVals = [selectedVals];
          }
        }

        return this.props.collection.filter(function (oneModel) {
          // val is already selected
          if (_.contains(selectedVals, oneModel.get(this.props.valueAttribute))) {
            return false;
          }
          // no search text entered
          if (q.length === 0) {
            return true;
          }
          var values = this.getSearchValues(oneModel);
          return _.some(values, function (oneValue) {
            if (typeof oneValue !== "string" || oneValue.length === 0) {
              return false;
            }
            return oneValue.toUpperCase().indexOf(q.toUpperCase()) !== -1;
          });
        }, this);
      },

      // given a model, return an array of values that should be checked for the search string
      getSearchValues: function (model) {
        var toReturn;
        if (typeof this.props.searchOn === "function") {
          toReturn = this.props.searchOn(model);
          if (!_.isArray(toReturn)) {
            toReturn = [toReturn];
          }
        }
        if (typeof this.props.searchOn === "string") {
          toReturn = [model.get(this.props.searchOn)];
        }
        if (_.isArray(this.props.searchOn)) {
          toReturn = [];
          _.each(this.props.searchOn, function (oneAttribute) {
            toReturn.push(model.get(oneAttribute));
          });
        }
        return toReturn || [];
      },

      setHilite: function (hilite) {
        hilite = Math.max(Math.min(hilite, this.state.results.length - 1), 0);
        if (hilite === this.state.hilite) {
          return;
        }
        // make sure whatever is hilited is scrolled into view for the results div
        var dropdownNode = this.refs.results.getDOMNode();
        var hilitedNode = this.refs["result-" + hilite].getDOMNode();
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
        this.setState({
          hilite: hilite
        });
      },

      setCursorPosition: function (cp) {

      },

      handleKeydown: function (e) {

        switch (e.keyCode) {
          //handle key navigation of the result list
          case KEY_DOWN:
            this.setHilite(this.state.hilite + 1);
            break;
          case KEY_UP:
            this.setHilite(this.state.hilite - 1);
            break;
          case KEY_PAGE_UP:
            this.setHilite(this.state.hilite - 10);
            break;
          case KEY_PAGE_DOWN:
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
        }
      },

      openResults: function () {
        this.setState({
          open: true,
          results: this.getResults(this.state.searchText)
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
        var open = this.state.open;
        if (!this.props.multiple || this.props.closeOnSelect) {
          open = false;
        }
        var newResults = this.getResults();
        this.setState({
          results: newResults,
          open: open,
          hilite: Math.min(this.state.hilite, newResults.length)
        });
      },

      closeResults: function () {
        this.setState({
          open: false,
          searchText: ""
        });
      },

      // handle a click of the select field
      handleSelectClick: function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.refs.search.focus();
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
        // render a hidden select so $.formData() works as expected
        var realSelect = select(_.extend({}, this.props, {
          style: {
            display: "none"
          }
        }));
        children.push(realSelect);

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
        // fake input is a div that contains the real input plus the selected items
        var fakeInput = React.DOM.div(_.extend({}, this.props, {
          onMouseDown: this.handleSelectClick,
          className: "fancy-select-fake-input " + openClassName + " " + (this.props.className || "")
        }), insideInput);
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
          className: "fancy-select-container"
        }, children);
      }

    });
  });