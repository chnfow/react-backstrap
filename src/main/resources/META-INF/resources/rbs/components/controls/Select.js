/**
 * A searchable dropdown
 */
define([ "react", "underscore", "jquery", "backbone", "../mixins/Events", "./SelectInput", "../collection/SelectResults" ],
  function (React, _, $, Backbone, events, selectInput, selectResults) {
    "use strict";

    var KEY_DOWN = 40;
    var KEY_UP = 38;
    var KEY_ENTER = 13;

    var KEY_ESCAPE = 27;
    var KEY_PAGE_UP = 33;
    var KEY_PAGE_DOWN = 34;
    var KEY_HOME = 36;
    var KEY_END = 35;


    return _.rf({
      displayName: "Attribute Select",
      mixins: [ events ],

      propTypes: {
        // the currently selected value
        value: React.PropTypes.any.isRequired,
        // how to handle a change of the value
        onChange: React.PropTypes.func.isRequired,
        valueAttribute: React.PropTypes.string,
        searchOn: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.arrayOf(React.PropTypes.string),
          React.PropTypes.func
        ]),
        caseInsensitive: React.PropTypes.bool,
        breakOn: React.PropTypes.string
      },

      componentDidMount: function () {
        this.listenTo(this.props.collection, "update reset", this.updateFilteredCollection);
      },

      getDefaultProps: function () {
        return {
          valueAttribute: "id",
          searchOn: "name",
          breakOn: " ",
          caseInsensitive: true
        };
      },

      getInitialState: function () {
        return {
          searchText: "",
          filteredCollection: new Backbone.Collection(),
          open: false
        };
      },

      handleChange: function (e) {
        this.doSearch(e.target.value);
      },

      doSearch: function (q) {
        this.updateFilteredCollection(q);
        this.setState({
          searchText: q
        });
      },

      // update this.state.filteredCollection to contain a filtered result set based on
      // the current model value and the search function
      updateFilteredCollection: function (q) {
        var selectedVals = this.props.value;
        // get an array of current values
        if (typeof selectedVals === "undefined" || selectedVals === null) {
          selectedVals = [];
        } else {
          if (!_.isArray(selectedVals)) {
            selectedVals = [ selectedVals ];
          }
        }

        var svf = this.getSearchValueFunction();
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

      // get the function (model) that will be used to extract values to check against the query string
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

      handleKeydown: function (e) {
        switch (e.keyCode) {
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
            this.handleSelect(this.refs.results.getHilitedModel());
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
          React.findDOMNode(this.refs.toFocus).focus();
        } else {
          var currentValue = this.props.value;
          var newValue;
          if (_.isArray(currentValue)) {
            newValue = currentValue.concat([ modelVal ]);
          } else {
            newValue = [ modelVal ];
          }
          this.props.onChange(newValue);
          this.doSearch("");
        }
      },

      handleRemove: function (model, value) {
        this.updateFilteredCollection(this.state.searchText);
      },

      // handle a click of the select field
      handleSelectClick: function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.refs.search.focus();
      },

      setOpen: function (value) {
        this.setState({ open: value, searchText: "" }, function () {
          if (this.state.open) {
            this.updateFilteredCollection(this.state.searchText);
          }
        });
      },

      hasValue: function () {
        return (typeof this.props.value !== "undefined" && this.props.value !== null && (!this.props.multiple || this.props.value.length > 0));
      },

      render: function () {
        var children = [];

        children.push(
          selectInput(_.extend({}, this.props, {
            key: "input",
            value: this.state.searchText,
            onChange: this.handleChange,
            onFocus: _.bind(this.setOpen, this, true),
            onBlur: _.bind(this.setOpen, this, false),
            onKeyDown: this.handleKeydown,
            onRemove: this.handleRemove
          }))
        );

        var className;
        if (this.state.open) {
          className = "fancy-select-search-results-open";
        }
        children.push(
          selectResults(_.extend({}, this.props, {
            key: "results",
            ref: "results",
            collection: this.state.filteredCollection,
            onSelect: this.handleSelect,
            className: className
          }))
        );

        children.push(
          React.DOM.div({
            key: "toFocus",
            ref: "toFocus",
            className: "fancy-select-search-focus-on-select",
            tabIndex: -1
          })
        );

        return React.DOM.div({
          className: "fancy-select-container",
          ref: "container"
        }, children);
      }

    })
      ;
  })
;