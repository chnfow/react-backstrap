define(["react", "underscore", "jquery", "backbone", "./SelectInput", "../collection/SelectResults"],
  function (React, _, $, Backbone, selectInput, selectResults) {

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

      propTypes: {
        valueAttribute: React.PropTypes.string,
        searchOn: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.arrayOf(React.PropTypes.string),
          React.PropTypes.func
        ]),
        caseInsensitive: React.PropTypes.bool,
        breakOn: React.PropTypes.string
      },

      getDefaultProps: function () {
        return {
          searchOn: "name",
          breakOn: " ",
          caseInsensitive: true
        };
      },

      getInitialState: function () {
        return {
          searchText: "",
          filteredCollection: new Backbone.Collection()
        };
      },

      doSearch: function (e) {
        var q = e.target.value;
        this.updateFilteredCollection(q);
        this.setState({
          searchText: q
        });
      },

      // this returns an array of models for which the getSearchValues function returns a value that includes the
      // search parameter q
      updateFilteredCollection: function (q) {
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
        if (this.props.caseInsensitive) {
          q = q.toUpperCase();
        }

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
            return oneValue.indexOf(q) !== -1;
          });
        }, this));
      },

      // for performance reasons, get a function to use to collect search values from a model
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
              return val;
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
            this.closeResults();
            break;
          // handle key selection of a result
          case KEY_ENTER:
            this.handleSelect(this.state.hilite, e);
            break;
        }
      },

      openResults: function () {
        this.updateFilteredCollection("");
        this.setState({
          open: true,
          searchText: ""
        });
      },

      closeResults: function () {
        this.setState({
          open: false,
          searchText: ""
        });
      },

      handleSelect: function (resultIndex, e) {
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
          var newValue = _.clone(newValue);
          if (_.isArray(currentValue)) {
            newValue = _.clone(currentValue);
            var length = currentValue.length;
            newValue.splice(Math.max(0, length - this.state.cursorPosition), 0, modelVal);
          } else {
            newValue = [modelVal];
          }
          this.props.model.set(this.props.attribute, newValue);
        }
        if (!this.props.multiple || this.props.closeOnSelect) {
          this.closeResults();
        }
        var newResults = this.getResults("");
      },

      // handle a click of the select field
      handleSelectClick: function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.refs.search.focus();
      },

      render: function () {
        var children = [];

        children.push(selectInput(_.extend({}, this.props, {value: this.state.searchText})));
        children.push(selectResults(_.extend({}, this.props, {collection: this.state.filteredCollection})));

        return React.DOM.div({
          className: "fancy-select-container",
          ref: "container"
        }, children);
      }

    })
      ;
  })
;