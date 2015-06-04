define(["react", "underscore", "../mixins/Attribute", "../mixins/Collection", "./Select"],
  function (React, _, attribute, collection, select) {

    "use strict";

    return _.rf({

      mixins: [attribute, collection],

      propTypes: {
        multiple: React.PropTypes.bool,
        // what aspect of the model do we search on
        searchOn: React.PropTypes.oneOfType([
          React.PropTypes.func,
          React.PropTypes.string,
          React.PropTypes.arrayOf(React.PropTypes.string)
        ])
      },

      getDefaultProps: function () {
        return {
          multiple: false,
          // search on the text attribute of the model
          searchOn: "text"
        };
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
        return this.props.collection.filter(function (oneModel) {
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

      moveHilite: function (e) {
        if (e.keyCode === 40) {
          // DOWN key
          this.setState({
            hilite: Math.min(this.state.hilite + 1, Math.max(this.state.results.length - 1, 0))
          });
        } else if (e.keyCode === 38) {
          // UP Key
          this.setState({
            hilite: Math.max(this.state.hilite - 1, 0)
          });
        }
      },

      openResults: function () {
        this.setState({
          open: true
        });
      },

      closeResults: function () {
        this.setState({
          open: false
        });
      },

      render: function () {
        var children = [];
        // render a hidden select so this.saveData works as expected
        var realSelect = select(_.extend({}, this.props, {
          style: {
            display: "none"
          }
        }));
        children.push(realSelect);

        var autoCompleteInput = React.DOM.input(_.extend({}, this.props, {
          onChange: this.doSearch,
          onKeyDown: this.moveHilite,
          onFocus: this.openResults,
          onBlur: this.closeResults,
          value: this.state.searchText
        }));
        children.push(autoCompleteInput);

        if (this.state.open) {
          var i = 0;
          // take the models and turn them into model components, then wrap each one in a autocomplete-search-result div
          var results = _.map(this.getModels(this.state.results), function (oneResultComponent) {
            var style = (i++ === this.state.hilite) ? { backgroundColor: "yellow" } : {};
            return React.DOM.div({ className: "autocomplete-search-result", style: style }, oneResultComponent);
          }, this);
          // put all the results in an absolutely positioned div under the search box
          var searchResults = React.DOM.div({
            className: "autocomplete-search-results",
            style: {
              position: "absolute",
              width: "100%",
              left: 0
            }
          }, results);
          children.push(searchResults);
        }

        return React.DOM.div({
          style: {
            position: "relative",
            className: "autocomplete-container"
          }
        }, children);
      }

    });
  });