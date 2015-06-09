define(["react", "underscore", "../mixins/Collection"],
  function (React, _, collection) {
    "use strict";

    // renders a collection of results as the results of a select dropdown
    // fires an onSelect(model) event for when an option is clicked
    return _.rf({
      displayName: "Select Results",

      mixins: [collection, React.addons.PureRenderMixin],

      propTypes: {
        onSelect: React.PropTypes.func.isRequired
      },

      getDefaultProps: function () {
        return {};
      },

      getInitialState: function () {
        return {
          hilite: 0
        };
      },

      // functions for moving the hilite around by a parent object, since we shouldn't manipulate state directly
      next: function () {
        this.setHilite(this.state.hilite + 1);
      },
      previous: function () {
        this.setHilite(this.state.hilite - 1);
      },
      pageDown: function () {
        this.setHilite(this.state.hilite + 10);
      },
      pageUp: function () {
        this.setHilite(this.state.hilite - 10);
      },
      home: function () {
        this.setHilite(0);
      },
      end: function () {
        this.setHilite(this.props.collection.size() - 1);
      },

      setHilite: function (newHilite) {
        var max = this.props.collection.size() - 1;
        var min = 0;
        newHilite = Math.max(min, Math.min(max, newHilite));
        this.setState({
          hilite: newHilite
        }, this.scrollHiliteIntoView);
      },

      scrollHiliteIntoView: function () {
        var resultsNode = this.refs.results.getDOMNode();
        var hilitedNode = this.refs["result-" + this.state.hilite].getDOMNode();
        var resultsTop = resultsNode.scrollTop;
        var hiliteTop = hilitedNode.offsetTop;
        if (resultsTop > hiliteTop) {
          resultsNode.scrollTop = hiliteTop;
        } else {
          var resultsBottom = resultsNode.scrollTop + resultsNode.offsetHeight;
          var hiliteBottom = hilitedNode.offsetTop + hilitedNode.offsetHeight;
          if (resultsBottom < hiliteBottom) {
            resultsNode.scrollTop = hiliteBottom - resultsNode.offsetHeight;
          }
        }
      },

      handleSelect: function (model, e) {
        e.preventDefault();
        if (this.props.onSelect) {
          this.props.onSelect(model, e);
        }
      },

      getHilitedModel: function () {
        var hilited = this.refs["result-" + this.state.hilite];
        if (hilited) {
          return hilited.props.model;
        }
        return null;
      },

      render: function () {
        var i = 0;
        // take the models and turn them into model components, then wrap each one in a search result div
        var results = _.map(this.getModels(this.state.results), function (oneResultComponent) {
          var myIndex = i++;
          var optionClass = "fancy-select-search-result";
          if (myIndex === this.state.hilite) {
            optionClass += " hilited";
          }
          return React.DOM.div({
            className: optionClass,
            ref: "result-" + myIndex,
            model: oneResultComponent.props.model,
            key: "model-" + oneResultComponent.props.model.cid,
            onMouseOver: _.bind(this.setHilite, this, myIndex),
            onMouseDown: _.bind(this.handleSelect, this, oneResultComponent.props.model)
          }, oneResultComponent);
        }, this);

        // put all the results in an absolutely positioned div under the search box
        return React.DOM.div(_.extend({}, this.props, {
          className: "fancy-select-search-results " + (this.props.className || ""),
          ref: "results",
          key: "results"
        }), results);
      }
    });
  });