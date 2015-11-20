define([ "react", "react-dom", "underscore", "../mixins/Collection", "util", "../layout/Icon" ],
  function (React, dom, _, collection, util, icon) {
    "use strict";

    var rpt = React.PropTypes;
    var d = React.DOM;

    // renders a collection of results as the results of a select dropdown
    // fires an onSelect(model) event for when an option is clicked
    return util.rf({
      displayName: "Select Results",

      mixins: [ collection, React.addons.PureRenderMixin ],

      propTypes: {
        onSelect: rpt.func.isRequired,
        onBottom: rpt.func,
        maxHeight: rpt.number,
        minHeight: rpt.number,
        windowBottomBuffer: rpt.number,
        loading: rpt.bool.isRequired,
        loadingIcon: rpt.node
      },

      getDefaultProps: function () {
        return {
          onBottom: null,
          maxHeight: 320,
          minHeight: 100,
          windowBottomBuffer: 10,
          loadingIcon: icon({
            name: "refresh",
            animate: "spin"
          })
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
        var resultsNode = this.refs.results;
        var hilitedNode = this.refs[ "result-" + this.state.hilite ];
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
        var hl = this.state.hilite;
        if (hl < this.state.collection.length && hl >= 0) {
          return this.state.collection[ hl ];
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
          var resultsDiv = $(this.refs.results);
          var windowScrollTop = wind.scrollTop();
          // how far from the top of the window the select results are
          var divDistanceFromTop = resultsDiv.offset().top - windowScrollTop;
          // how tall the window is
          var windowHeight = wind.height();

          var maxHeight = (windowHeight - divDistanceFromTop) - this.props.windowBottomBuffer;
          maxHeight = Math.max(Math.min(this.props.maxHeight, maxHeight), this.props.minHeight);

          if (this.state.maxHeight !== maxHeight) {
            this.setState({
              maxHeight: maxHeight
            });
          }
        }
      },

      componentDidUpdate: function () {
        this.setHilite(this.state.hilite);
      },

      calculateStyle: function () {
        if (this.state.maxHeight !== null) {
          return _.extend({
            maxHeight: this.state.maxHeight
          }, this.props.style);
        }
        return this.props.style;
      },

      handleScroll: function () {
        if (typeof this.props.onBottom === null) {
          return;
        }
        var results = $(this.refs.results);
        var resultsWrapper = $(this.refs.resultsWrapper);
        if (results.height() + results.scrollTop() >= resultsWrapper.height()) {
          this.props.onBottom();
        }
      },

      wrapperFunction: function (reactEl, oneModel, index) {
        var optionClasses = [ "react-select-search-result" ];

        if (index === this.state.hilite) {
          optionClasses.push("hilited");
        }

        return d.div({
          key: "model-result-" + oneModel.cid,
          className: optionClasses.join(" "),
          ref: "result-" + index,
          onMouseOver: _.bind(this.setHilite, this, index),
          onMouseDown: this.doNothing,
          onClick: _.bind(this.handleSelect, this, oneModel)
        }, reactEl);
      },

      render: function () {
        var results = this.getModels();
        if (this.props.loading) {
          results.push(d.div({
            key: "loading-indicator",
            className: "react-select-search-result text-center"
          }, this.props.loadingIcon));
        }

        var style = this.calculateStyle();

        var cn = [ "react-select-search-results" ];
        if (typeof this.props.className === "string") {
          cn.push(this.props.className);
        }

        // put all the results in an absolutely positioned div under the search box
        return d.div(_.extend({}, this.props, {
          className: cn.join(" "),
          style: style,
          ref: "results",
          onScroll: this.handleScroll
        }), d.div({ ref: "resultsWrapper" }, results));
      }
    });
  });
