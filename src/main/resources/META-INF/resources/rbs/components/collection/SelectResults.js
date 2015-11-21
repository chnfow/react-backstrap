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
        loading: rpt.bool.isRequired,
        loadingIcon: rpt.node,
        multiple: rpt.bool.isRequired,
        value: rpt.any
      },

      getDefaultProps: function () {
        return {
          onBottom: null,
          loadingIcon: icon({
            name: "refresh",
            animate: "spin"
          })
        };
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
        this.setHilite(this.state.hilite + 5);
      },
      pageUp: function () {
        this.setHilite(this.state.hilite - 5);
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
        if (newHilite !== this.state.hilite) {
          this.setState({
            hilite: newHilite
          }, this.scrollHiliteIntoView);
        }
      },

      scrollHiliteIntoView: function () {
        var resultsNode = this.refs.results;
        var hilitedNode = this.refs[ "result-" + this.state.hilite ];
        if (typeof hilitedNode === "undefined" || hilitedNode === null) {
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

      componentDidUpdate: function () {
        this.setHilite(this.state.hilite);
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

        // determine whether this option is currently selected
        var selected = false;
        if (this.props.multiple) {
          if (_.isArray(this.props.value)) {
            if (this.props.valueAttribute !== null) {
              selected = _.contains(this.props.value, oneModel.get(this.props.valueAttribute));
            } else {
              selected = _.contains(_.pluck(this.props.value, "id"), oneModel.get("id"));
            }
          }
        } else {
          if (this.props.valueAttribute !== null) {
            selected = this.props.value === oneModel.get(this.props.valueAttribute);
          } else {
            selected = this.props.value.id === oneModel.get("id");
          }
        }

        if (selected) {
          optionClasses.push("selected");
        }

        return d.div({
          key: "model-result-" + oneModel.cid,
          className: optionClasses.join(" "),
          ref: "result-" + index,
          onMouseOver: _.bind(this.setHilite, this, index),
          onMouseDown: this.doNothing,
          onClick: selected ? this.doNothing : _.bind(this.handleSelect, this, oneModel)
        }, reactEl);
      },

      render: function () {
        var results = this.getModels();
        if (this.props.loading) {
          if (this.state.collection.length === 0) {
            results = [];
          }
          results.push(d.div({
            key: "loading-indicator",
            className: "react-select-search-result text-center"
          }, this.props.loadingIcon));
        }

        var cn = [ "react-select-search-results" ];
        if (typeof this.props.className === "string") {
          cn.push(this.props.className);
        }

        // put all the results in an absolutely positioned div under the search box
        return d.div(_.extend({}, this.props, {
          className: cn.join(" "),
          ref: "results",
          onScroll: this.handleScroll
        }), d.div({ ref: "resultsWrapper" }, results));
      }
    });
  });
