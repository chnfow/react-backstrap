define(["react", "underscore", "../mixins/Attribute", "../mixins/Collection", "./Select", "../controls/DynamicInput"],
  function (React, _, attribute, collection, select, dynamicInput) {

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
          searchText: "",
          hilite: 0,
          results: [],
          open: false
        };
      },

      doSearch: function (e) {
        var q = e.target.value;
        var results = this.getResults(q);

        this.setState({
          searchText: q,
          results: results,
          hilite: 0
        });
      },

      // this returns an array of models for which the getSearchValues function returns a value that includes the
      // search parameter q
      getResults: function (q) {
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
          // no search text entered
          if (q.length === 0) {
            return true;
          }
          // val is already selected
          if (_.contains(selectedVals, oneModel.get(this.props.valueAttribute))) {
            return false;
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

      handleKeydown: function (e) {
        switch (e.keyCode) {
          case KEY_DOWN:
            this.setHilite(this.state.hilite + 1);
            break;
          case KEY_UP:
            this.setHilite(this.state.hilite - 1);
            break;
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
        if (!selectedModel) {
          return;
        }
        if (!this.props.multiple) {
          this.props.model.set(this.props.attribute, selectedModel.get(this.props.valueAttribute));
        } else {
          var currentValue = this.getValue();
          if (typeof currentValue === "undefined" || currentValue === null) {
            currentValue = [];
          }
          if (!_.isArray(currentValue)) {
            currentValue = [currentValue];
          }
          if (!_.contains(currentValue, selectedModel.get(this.props.valueAttribute))) {
            currentValue.push(selectedModel.get(this.props.valueAttribute));
          }
          this.props.model.set(this.props.attribute, currentValue);
        }
        if (!this.props.multiple || this.props.closeOnSelect) {
          this.refs.search.blur();
        }
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

      render: function () {
        var children = [];
        // render a hidden select so $.formData() works as expected
        var realSelect = select(_.extend({}, this.props, {
          style: {
            display: "none"
          }
        }));
        children.push(realSelect);

        var val = this.getValue();

        // fake input is a div that contains the real input plus the selected items
        var fakeInput = React.DOM.div(_.extend({}, this.props, {
          onMouseDown: this.handleSelectClick
        }), [
          dynamicInput({
            style: { outline: 0, border: 0 },
            ref: "search",
            onChange: this.doSearch,
            onKeyDown: this.handleKeydown,
            onFocus: this.openResults,
            onBlur: this.closeResults,
            value: this.state.searchText
          })
        ]);
        children.push(fakeInput);

        if (this.state.open) {
          var i = 0;
          // take the models and turn them into model components, then wrap each one in a autocomplete-search-result div
          var results = _.map(this.getModels(this.state.results), function (oneResultComponent) {
            var myIndex = i++;
            var style = (myIndex === this.state.hilite) ? { backgroundColor: "yellow" } : {};
            return React.DOM.div({
              className: "autocomplete-search-result",
              ref: "result-" + myIndex,
              style: style,
              onMouseOver: _.bind(this.setHilite, this, myIndex),
              onMouseDown: _.bind(this.selectResult, this, myIndex)
            }, oneResultComponent);
          }, this);
          // put all the results in an absolutely positioned div under the search box
          var searchResults = React.DOM.div({
            className: "autocomplete-search-results",
            ref: "results",
            style: {
              width: "100%",
              position: "absolute",
              overflowY: "auto",
              maxHeight: "400px"
            }
          }, results);
          children.push(searchResults);
        }

        return React.DOM.div({
          className: "select-container",
          style: {
            position: "relative"
          }
        }, children);
      }

    });
  });