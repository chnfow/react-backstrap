define([ "react", "underscore", "../mixins/Collection" ],
  function (React, _, collection) {
    "use strict";


    var MAX_HEIGHT_EM = 20;
    var MIN_HEIGHT_EM = 3;
    var BOTTOM_BUFFER = 1;
    var ONE_EM = 16;

    // renders a collection of results as the results of a select dropdown
    // fires an onSelect(model) event for when an option is clicked
    return _.rf({
      displayName: "Select Results",

      mixins: [ collection, React.addons.PureRenderMixin ],

      propTypes: {
        onSelect: React.PropTypes.func.isRequired,
        emptyMessage: React.PropTypes.node
      },

      getDefaultProps: function () {
        return {
          emptyMessage: "No options found."
        };
      },

      getInitialState: function () {
        return {
          hilite: 0,
          maxHeight: null
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
        this.setHilite(this.state.hilite + this.getPageSize());
      },
      pageUp: function () {
        this.setHilite(this.state.hilite - this.getPageSize());
      },
      home: function () {
        this.setHilite(0);
      },
      end: function () {
        this.setHilite(this.state.collection.length - 1);
      },

      getPageSize: function () {
        return Math.max(Math.floor(this.state.maxHeight / 3), 1)
      },

      setHilite: function (newHilite) {
        var max = this.state.collection.length - 1;
        var min = 0;
        newHilite = Math.max(min, Math.min(max, newHilite));
        if (newHilite !== this.state.hilite) {
          this.setState({
            hilite: newHilite
          }, this.scrollHiliteIntoView);
        }
      },

      scrollHiliteIntoView: function () {
        var resultsNode = React.findDOMNode(this.refs.results);
        var hilitedNode = React.findDOMNode(this.refs[ "result-" + this.state.hilite ]);
        if (hilitedNode === null) {
          return;
        }
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

      doNothing: function (e) {
        e.preventDefault();
        e.stopPropagation();
      },

      handleSelect: function (model, e) {
        this.props.onSelect(model, e);
      },

      getHilitedModel: function () {
        var hilited = this.refs[ "result-" + this.state.hilite ];
        if (hilited) {
          return hilited.props.model;
        }
        return null;
      },

      componentDidMount: function () {
        this.calculateMaxHeight = _.debounce(_.bind(this._calculateMaxHeight, this), 20);
        this.calculateMaxHeight();
        $(window).on("resize", this.calculateMaxHeight);
      },

      componentWillUnmount: function () {
        $(window).off("resize", this.calculateMaxHeight);
      },

      _calculateMaxHeight: function () {
        if (this.isMounted()) {
          var wind = $(window);
          var resultsDiv = $(React.findDOMNode(this.refs.results));
          var windowScrollTop = wind.scrollTop();
          // how far from the top of the window the select results are
          var divDistanceFromTop = resultsDiv.offset().top - windowScrollTop;
          // how tall the window is
          var windowHeight = wind.height();

          var maxHeightInEm = Math.round((windowHeight - divDistanceFromTop) / ONE_EM) - BOTTOM_BUFFER;
          maxHeightInEm = Math.max(Math.min(MAX_HEIGHT_EM, maxHeightInEm), MIN_HEIGHT_EM);

          if (this.state.maxHeight !== maxHeightInEm) {
            this.setState({
              maxHeight: maxHeightInEm
            });
          }
        }
      },

      componentDidUpdate: function () {
        this.setHilite(this.state.hilite);
      },

      calculateStyle: function () {
        if (this.state.maxHeight !== null) {
          return {
            maxHeight: this.state.maxHeight + "em"
          };
        }
        return {};
      },

      render: function () {
        var i = 0;
        // wrap each result in a div
        var results = _.map(this.getModels(), function (oneResultComponent) {
          var myIndex = i++;
          var optionClass = "react-select-search-result";
          if (myIndex === this.state.hilite) {
            optionClass += " hilited";
          }
          return React.DOM.div({
            key: "model-result-" + oneResultComponent.props.model.cid,
            className: optionClass,
            ref: "result-" + myIndex,
            model: oneResultComponent.props.model,
            onMouseOver: _.bind(this.setHilite, this, myIndex),
            onMouseDown: this.doNothing,
            onClick: _.bind(this.handleSelect, this, oneResultComponent.props.model)
          }, oneResultComponent);
        }, this);

        // empty message
        if (results.length === 0) {
          results.push(React.DOM.div({
            className: "react-select-search-result",
            key: "no-results"
          }, this.props.emptyMessage));
        }

        var style = this.calculateStyle();

        // put all the results in an absolutely positioned div under the search box
        return React.DOM.div(_.extend({}, this.props, {
          className: "react-select-search-results " + (this.props.className || ""),
          style: style,
          ref: "results"
        }), results);
      }
    });
  });
