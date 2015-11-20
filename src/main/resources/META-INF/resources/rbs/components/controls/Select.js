/**
 * A searchable dropdown, controlled input
 */
define([ "react", "react-dom", "underscore", "jquery", "backbone", "../mixins/Events", "../collection/SelectResults",
    "./DynamicInput", "util" ],
  function (React, dom, _, $, Backbone, events, selectResults, dynamicInput, util) {
    "use strict";

    var KEY_DOWN = 40;
    var KEY_UP = 38;
    var KEY_ENTER = 13;
    var KEY_TAB = 9;

    var KEY_ESCAPE = 27;
    var KEY_PAGE_UP = 33;
    var KEY_PAGE_DOWN = 34;
    var KEY_HOME = 36;
    var KEY_END = 35;

    var KEY_BACKSPACE = 8;
    var KEY_LEFT = 37;
    var KEY_RIGHT = 39;
    var KEY_DELETE = 46;

    var rpt = React.PropTypes;
    var d = React.DOM;

    return util.rf({
      displayName: "RBS Select",

      mixins: [ events ],

      propTypes: {
        // the currently selected value or values
        value: rpt.any,
        // handler for change of the currently selected value, takes one argument which is the new value
        onChange: rpt.func.isRequired,
        // the attribute of the models passed to the collection that is used to represent the selection.
        // leave null to indicate that the entire model json should be set into the attribute
        valueAttribute: rpt.string,
        // either an attribute name, a list of attribute names or a function that produces an array
        // of values that can be searched
        searchOn: rpt.oneOfType([
          rpt.string,
          rpt.arrayOf(rpt.string),
          rpt.func
        ]),
        // what to break the search string on
        breakOn: rpt.string,
        emptyNode: rpt.node
      },

      getDefaultProps: function () {
        return {
          valueAttribute: null,
          searchOn: "name",
          breakOn: " ",
          multiple: false,
          placeholder: "Select...",
          emptyNode: "No results found."
        };
      },

      getInitialState: function () {
        return {
          // the user's currently typed search text
          searchText: "",
          // the filtered results
          filteredCollection: new Backbone.Collection(),
          // where the cursor is placed in a multi-select among the results
          cursorPosition: 0,
          // whether the dropdown is open
          open: false
        };
      },

      componentDidMount: function () {
        this.listenTo(this.props.collection, "update reset", this.handleCollectionChange);
      },

      // when the collection is updated or reset we need to update the list of results
      handleCollectionChange: function () {
        this.updateResults();
      },

      // when the input changes we need to do a new search
      handleChange: function (e) {
        this.doSearch(e.target.value);
      },

      // update the search text and search for models that match the q
      doSearch: function (q) {
        util.debug("updating filtered collection for a new search value", q);
        this.updateFilteredCollection(q, this.props.value);
        this.setState({
          searchText: q,
          cursorPosition: 0
        });
      },

      getDisplayItem: function (className, model) {
        return d.span({
          className: className,
          key: "result-cid-" + model.cid
        }, this.props.modelComponent({ model: model }));
      },

      // update this.state.filteredCollection to contain a filtered result set based on
      // the current model value and the search function
      updateFilteredCollection: function (q, selectedVals) {
        return;
        // get an array of current values
        if (typeof selectedVals === "undefined" || selectedVals === null) {
          selectedVals = [];
        } else {
          if (!_.isArray(selectedVals)) {
            selectedVals = [ selectedVals ];
          }
        }
        // the function that extracts searchable values out of a model
        var svf = this.getSearchValueFunction();
        // the function that determines whether a value matches the search string
        var matcher = this.getMatcherFunction(q);

        this.state.filteredCollection.set(this.props.collection.filter(function (oneModel) {
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
            return matcher(oneValue);
          });
        }, this));
      },

      // get the function that will be used to extract values to check against the query string
      getSearchValueFunction: function () {
        var toReturn;
        var caseInsensitive = this.props.caseInsensitive;
        switch (typeof this.props.searchOn) {
          case "function":
            toReturn = _.bind(this.props.searchOn, this);
            break;
          case "string":
            var attr = this.props.searchOn;
            toReturn = function (model) {
              var val = model.get(attr);
              if (val && val.toString) {
                val = val.toString();
              }
              if (caseInsensitive && typeof val === "string") {
                val = val.toUpperCase();
              }
              return [ val ];
            };
            break;
          case "object":
            var attrs = this.props.searchOn;
            toReturn = function (model) {
              return _.map(attrs, function (oneAttr) {
                var val = model.get(oneAttr);
                if (val && val.toString) {
                  val = val.toString();
                }
                if (caseInsensitive && typeof val === "string") {
                  val = val.toUpperCase();
                }
                return val;
              });
            };
            break;
        }
        return toReturn;
      },

      getMatcherFunction: function (q) {
        if (this.props.caseInsensitive) {
          q = q.toUpperCase();
        }
        var matcher = function (oneValue) {
          return oneValue.indexOf(q) !== -1;
        };
        if (this.props.breakOn) {
          q = _.uniq(q.split(this.props.breakOn));
          // we need to use different logic for matching
          matcher = function (oneValue) {
            return _.all(q, function (oneQ) {
              return oneValue.indexOf(oneQ) !== -1;
            });
          };
        }
        return matcher;
      },

      setCursorPosition: function (cp) {
        var val = this.props.value;
        if (!_.isArray(val)) {
          cp = 0;
        } else {
          cp = Math.max(0, Math.min(val.length, cp));
        }
        this.setState({
          cursorPosition: cp
        });
      },

      removeSelectedItemAt: function (countFromLast) {
        if (!this.props.multiple || typeof countFromLast !== "number") {
          this.props.onChange();
          return;
        }
        var currentValue = this.props.value;
        if (this.props.multiple && !_.isArray(currentValue)) {
          return;
        }
        var realIndex = currentValue.length - countFromLast;
        if (currentValue.length <= realIndex || realIndex < 0) {
          return;
        }
        var newValue = _.clone(currentValue);
        newValue.splice(realIndex, 1);

        this.props.onChange(newValue);

        this.setState({
          cursorPosition: countFromLast - 1
        });
      },

      handleKeyDown: function (e) {
        switch (e.keyCode) {
          case KEY_LEFT:
          case KEY_RIGHT:
          case KEY_BACKSPACE:
          case KEY_DELETE:
            // this is true of all the actions
            if (this.state.searchText.length > 0) {
              return;
            }
            // switch again
            switch (e.keyCode) {
              // left and right do basically the same thing
              case KEY_LEFT:
              case KEY_RIGHT:
                this.setCursorPosition(this.state.cursorPosition + (e.keyCode === KEY_LEFT ? 1 : -1));
                break;
              // same with backspace/delete
              case KEY_BACKSPACE:
              case KEY_DELETE:
                this.removeSelectedItemAt(this.state.cursorPosition + (e.keyCode === KEY_BACKSPACE ? 1 : 0));
                break;
            }
            break;
          //handle key navigation of the result list
          case KEY_DOWN:
            e.preventDefault();
            this.refs.results.next();
            break;
          case KEY_UP:
            e.preventDefault();
            this.refs.results.previous();
            break;
          case KEY_PAGE_UP:
            e.preventDefault();
            this.refs.results.pageUp();
            break;
          case KEY_PAGE_DOWN:
            e.preventDefault();
            this.refs.results.pageDown();
            break;
          case KEY_END:
            e.preventDefault();
            this.refs.results.end();
            break;
          case KEY_HOME:
            e.preventDefault();
            this.refs.results.home();
            break;
          case KEY_ESCAPE:
            this.setOpen(false);
            break;
          // handle key selection of a result
          case KEY_ENTER:
            e.preventDefault();
            this.handleSelect(this.refs.results.getHilitedModel());
            break;
          case KEY_TAB:
            if (this.state.filteredCollection.size() === 1) {
              var hm = this.refs.results.getHilitedModel();
              if (hm !== null) {
                e.preventDefault();
                this.handleSelect(hm);
              }
            }
            break;
        }
      },

      handleSelect: function (selectedModel) {
        if (!selectedModel) {
          return;
        }

        var modelVal = selectedModel.get(this.props.valueAttribute);
        if (!this.props.multiple) {
          this.props.onChange(modelVal);
          dom.findDOMNode(this.refs.toFocus).focus();
        } else {
          var currentValue = this.props.value;
          var newValue;
          if (_.isArray(currentValue)) {
            newValue = currentValue.concat([ modelVal ]);
          } else {
            newValue = [ modelVal ];
          }
          this.setState({
            searchText: ""
          }, function () {
            this.doSearch(this.state.searchText);
            this.props.onChange(newValue);
          });
        }
      },

      doNothing: function (e) {
        e.preventDefault();
        e.stopPropagation();
      },

      // handle a click of the select field
      handleSelectClick: function () {
        this.refs.search.focus();
      },

      updateResults: function () {
        this.updateFilteredCollection(this.state.searchText, this.props.value);
      },

      setOpen: function (open) {
        this.setState({ open: open, searchText: "" }, function () {
          if (this.state.open) {
            util.debug("updating filtered collection on open");
            this.updateResults();
          }
        });
      },

      componentWillReceiveProps: function (nextProps) {
        if (this.state.open && nextProps.value !== this.props.value) {
          util.debug("updating filtered collection on receiving a new value");
          this.updateFilteredCollection(this.state.searchText, nextProps.value);
        }
        // re-listen
        if (nextProps.collection !== this.props.collection) {
          this.stopListening(this.props.collection);
          this.listenTo(nextProps.collection);
        }
      },

      renderFakeInput: function () {
        // the currently selected values
        var currentValue = this.props.value;

        // get all the views for the selected items
        var selectedItems = [];
        //if (!this.props.multiple) {
        //  if (this.state.searchText.length === 0) {
        //    var model = this.findModelByValue(currentValue);
        //    if (model) {
        //      selectedItems = [ this.getDisplayItem("react-select-single-choice", model) ];
        //    }
        //  }
        //} else {
        //  if (_.isArray(currentValue)) {
        //    // items not found in the collection are not displayed
        //    var selectedModels = _.filter(_.map(currentValue, this.findModelByValue, this), Boolean);
        //    // map them into views
        //    selectedItems = _.map(selectedModels, _.bind(this.getDisplayItem, this, "react-select-multiple-choice"));
        //  }
        //}

        //only display the placeholder if there is no value selected
        var placeholder;
        if (this.props.placeholder && selectedItems.length === 0) {
          placeholder = this.props.placeholder;
        }

        var required = this.props.required;
        if (required && currentValue !== null && typeof currentValue !== "undefined") {
          if (this.props.multiple) {
            // if it's multiple, one must be selected
            if (_.isArray(currentValue) && currentValue.length > 0) {
              required = false;
            }
          } else {
            // otherwise it has a value so it's not required any longer
            required = false;
          }
        }

        // create the typing area input
        var typingArea = dynamicInput({
          // don't take the styling for the input since this is just where the cursor goes
          className: "react-select-type-area",
          ref: "search",
          key: "search",
          onKeyDown: this.handleKeyDown,
          onFocus: _.bind(this.setOpen, this, true),
          onBlur: _.bind(this.setOpen, this, false),
          onChange: this.handleChange,
          placeholder: placeholder,
          required: required,
          value: this.state.searchText,
          id: this.props.id
        });

        // determine what will go into the final div that will look like the input
        var insideInput;
        if (!this.props.multiple || (!this.props.value) || (this.props.value.length === 0)) {
          insideInput = selectedItems.concat(typingArea);
        } else {
          var position = selectedItems.length - this.state.cursorPosition;
          selectedItems.splice(position, 0, typingArea);
          insideInput = selectedItems;
        }

        // show a caret to indicate whether the input is open
        insideInput.push(d.span({
          key: "caret",
          className: "caret"
        }));

        var openClassName = "";
        if (this.state.open) {
          openClassName = "dropup";
        }

        var fakeInputProps = _.omit(_.extend({}, this.props, {
          key: "fake-input",
          ref: "fakeInput",
          onMouseDown: this.doNothing,
          onClick: this.handleSelectClick,
          className: "react-select-fake-input " + openClassName + " " + (this.props.className || "")
        }), "id", "onKeyDown", "onFocus", "onBlur", "placeholder", "children", "onChange");

        return d.div(fakeInputProps, insideInput);
      },

      renderResults: function () {
        var className;
        if (this.state.open) {
          className = "react-select-search-results-open";
        }

        return selectResults({
          key: "results",
          ref: "results",
          collection: this.state.filteredCollection,
          onSelect: this.handleSelect,
          modelComponent: this.props.modelComponent,
          className: className,
          emptyNode: this.props.emptyNode
        });
      },

      renderTabDiv: function () {
        return d.div({
          key: "toFocus",
          ref: "toFocus",
          className: "react-select-search-focus-on-select",
          tabIndex: -1
        });
      },

      render: function () {
        return d.div({
          className: "react-select-container",
          ref: "container"
        }, [ this.renderFakeInput(), this.renderResults(), this.renderTabDiv() ]);
      }
    });
  });
