define([ "react", "underscore", "../mixins/Collection" ],
  function (React, _, collection) {
    "use strict";

    // renders a collection of results as the results of a select dropdown
    // fires an onSelect(model) event for when an option is clicked
    return _.rf({
      displayName: "Select Results",

      mixins: [ collection, React.addons.PureRenderMixin ],

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
        this.setHilite(this.state.collection.length - 1);
      },

      setHilite: function (newHilite) {
        var max = this.state.collection.length - 1;
        var min = 0;
        newHilite = Math.max(min, Math.min(max, newHilite));
        this.setState({
          hilite: newHilite
        }, this.scrollHiliteIntoView);
      },

      scrollHiliteIntoView: function () {
        var resultsNode = React.findDOMNode(this.refs.results);
        var hilitedNode = React.findDOMNode(this.refs[ "result-" + this.state.hilite ]);
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
        var hilited = this.refs[ "result-" + this.state.hilite ];
        if (hilited) {
          return hilited.props.model;
        }
        return null;
      },

      render: function () {
        var i = 0;
        // take the models and turn them into model components, then wrap each one in a search result div
        var results = _.map(this.getModels(), function (oneResultComponent) {
          var myIndex = i++;
          var optionClass = "fancy-select-search-result";
          if (myIndex === this.state.hilite) {
            optionClass += " hilited";
          }
          return React.DOM.div({
            className: optionClass,
            ref: "result-" + myIndex,
            model: oneResultComponent.props.model,
            key: "model-result-" + oneResultComponent.props.model.cid,
            onMouseOver: _.bind(this.setHilite, this, myIndex),
            onMouseDown: _.bind(this.handleSelect, this, oneResultComponent.props.model)
          }, oneResultComponent);
        }, this);

        // put all the results in an absolutely positioned div under the search box
        return React.DOM.div(_.extend({}, this.props, {
          className: "fancy-select-search-results " + (this.props.className || ""),
          ref: "results"
        }), results);
      }
    });
  });