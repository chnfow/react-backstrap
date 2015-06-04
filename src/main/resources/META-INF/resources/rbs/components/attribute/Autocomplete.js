define(["react", "underscore-extras", "../mixins/Attribute", "../mixins/Collection", "./Select"],
  function (React, _, attribute, collection, select) {

    "use strict";

    return _.rf({

      mixins: [attribute, collection],

      propTypes: {
      },

      getDefaultProps: function () {
        return {
        };
      },

      getInitialState: function () {
        return {
          searchText: ""
        };
      },

      doSearch: function (e) {
        var val = e.target.value;
        this.setState({
          searchText: val
        });
      },

      render: function () {
        // render a hidden select so this.saveData works as expected
        var realSelect = select(_.extend({}, this.props, {
          style: {
            display: "none"
          }
        }));

        var autoCompleteInput = React.DOM.input(_.extend({}, this.props, {
          onChange: this.doSearch,
          value: this.state.searchText
        }));

        var searchResults = React.DOM.div({
          className: "search-results",
          style: {
            position: "absolute"
          }
        });

        return React.DOM.div({
          style: {
            position: "relative"
          }
        }, [realSelect, autoCompleteInput, searchResults]);
      }

    });
  });