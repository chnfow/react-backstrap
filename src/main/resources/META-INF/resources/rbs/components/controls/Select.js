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
        // the component used to render a single result
        modelComponent: rpt.func.isRequired,
        // the currently selected value or values
        value: rpt.any,
        // handler for change of the currently selected value, takes one argument which is the new value
        onChange: rpt.func.isRequired,
        // the attribute of the models passed to the collection that is used to represent the selection.
        // leave null to indicate that the entire model json should be set into the attribute
        valueAttribute: rpt.string,
        // name of the model attribute to search on
        searchOn: rpt.string,
        // the node to display when there are no results
        emptyMessage: rpt.node
      },

      getDefaultProps: function () {
        return {
          valueAttribute: null,
          searchOn: "name",
          multiple: false,
          placeholder: "Select...",
          emptyMessage: "No results found."
        };
      },

      getInitialState: function () {
        return {
          // the user's currently typed search text
          searchText: "",
          // the results to display
          results: new Backbone.Collection(),
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
        this.updateResults(q);
        this.setState({
          searchText: q,
          cursorPosition: 0
        });
      },

      // based on the search text and the passed in collection update the results collection
      updateResults: function () {

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

        var cv = this.props.value;

        if (this.props.valueAttribute === null) {
          var toAdd = selectedModel.toJSON();
          if (this.props.multiple) {
            if (_.isArray(cv)) {
              this.props.onChange(cv.concat(toAdd));
            } else {
              this.props.onChange([ toAdd ]);
            }
          } else {
            this.props.onChange(toAdd);
          }
        } else {
          var modelVal = selectedModel.get(this.props.valueAttribute);
          if (this.props.multiple) {
            var newValue;
            if (_.isArray(cv)) {
              newValue = cv.concat([ modelVal ]);
            } else {
              newValue = [ modelVal ];
            }
            this.setState({
              searchText: ""
            }, function () {
              this.props.onChange(newValue);
            });
          } else {
            this.props.onChange(modelVal);
            dom.findDOMNode(this.refs.toFocus).focus();

          }
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

      setOpen: function (open) {
        this.setState({ open: open, searchText: "" }, function () {
          if (this.state.open) {
            util.debug("updating filtered collection on open");
            this.updateResults();
          }
        });
      },

      componentDidUpdate: function (prevProps, prevState) {
        if (this.state.open && prevProps !== this.props.value) {
          util.debug("updating filtered collection after receiving a new value");
          this.updateResults();
        }
        // re-listen
        if (prevProps.collection !== this.props.collection) {
          this.stopListening(prevProps.collection);
          this.listenTo(this.props.collection, "update reset", this.handleCollectionChange);
        }
      },

      renderFakeInput: function () {
        // the currently selected values
        var currentValue = this.props.value;

        // get all the components for the selected items
        var selectedItems = [];
        if (this.props.multiple) {
          if (_.isArray(currentValue)) {

          }
        } else {

        }

        //only display the placeholder if there is no value selected
        var placeholder;
        if (this.props.placeholder && selectedItems.length === 0) {
          placeholder = this.props.placeholder;
        }

        // the fake input is always going to have an empty value, but it should be required if no option is selected
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

        // determine where the typing area will go in the fake input
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

        //fake input classname
        var fiCn = [ "react-select-fake-input" ];
        if (typeof this.props.className === "string") {
          fiCn.push(this.props.className);
        }
        if (this.state.open) {
          fiCn.push("dropup");
        }

        var fakeInputProps = {
          key: "fake-input",
          ref: "fakeInput",
          onMouseDown: this.doNothing,
          onClick: this.handleSelectClick,
          className: fiCn.join(" ")
        };

        return d.div(fakeInputProps, insideInput);
      },

      // handle the user reaching the bottom of the results
      handleBottom: function () {
        util.debug("bottomed out on results");
      },

      // render the results div
      renderResults: function () {
        var className;
        if (this.state.open) {
          className = "react-select-search-results-open";
        }

        return selectResults({
          key: "results",
          ref: "results",
          collection: this.state.results,
          onSelect: this.handleSelect,
          onBottom: this.handleBottom,
          modelComponent: this.props.modelComponent,
          className: className,
          emptyNode: d.div({
            key: "empty-results-message",
            className: "react-select-search-result"
          }, this.props.emptyMessage)
        });
      },

      // this div is focused when tabbing away from the select so tab can be used again to select the next element
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
