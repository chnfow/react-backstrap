define(["react", "underscore", "../mixins/Attribute", "../mixins/Collection", "./Select", "../controls/DynamicInput"],
  function (React, _, attribute, collection, select, dynamicInput) {

    "use strict";

    var KEY_DOWN = 40;
    var KEY_UP = 38;
    var KEY_ENTER = 13;
    var KEY_BACKSPACE = 8;

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
          searchOn: "name"
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

      setHilite: function (hilite) {
        hilite = Math.max(Math.min(hilite, this.state.results.length - 1), 0);
        if (hilite === this.state.hilite) {
          return;
        }
        // make sure whatever is hilited is scrolled into view for the results div
        var results = this.refs.results.getDOMNode();
        var hilited = this.refs["result-" + hilite].getDOMNode();
        var resultsTop = results.scrollTop;
        var hiliteTop = hilited.offsetTop;
        var resultsBottom = results.scrollTop + results.offsetHeight;
        var hiliteBottom = hilited.offsetTop + hilited.offsetHeight;
        if (resultsTop > hiliteTop) {
          results.scrollTop = hiliteTop;
        } else if (resultsBottom < hiliteBottom) {
          results.scrollTop = hiliteBottom - results.offsetHeight;
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
        console.log(this.state.results[resultIndex]);
      },

      closeResults: function () {
        this.setState({
          open: false
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