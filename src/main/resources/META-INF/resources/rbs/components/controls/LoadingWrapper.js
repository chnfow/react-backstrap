/**
 * Draws an icon that spins to indicate an element is loading, and optionally a backdrop over the element to prevent
 * user interaction until the element is done loading all the data
 */
define(["react", "underscore", "../mixins/Events", "../layout/Icon"], function (React, _, events, icon) {
  "use strict";

  return _.rf({
    mixins: [events],

    propTypes: {
      watch: React.PropTypes.oneOfType([
        React.PropTypes.arrayOf(React.PropTypes.object),
        React.PropTypes.object
      ]).isRequired,
      icon: React.PropTypes.string,
      animate: React.PropTypes.string,
      size: React.PropTypes.string,
      backdrop: React.PropTypes.bool,
      hideWhileLoading: React.PropTypes.bool
    },

    getDefaultProps: function () {
      return {
        icon: "refresh",
        animate: "spin",
        size: "3x",
        backdrop: false,
        hideWhileLoading: false
      };
    },


    getInitialState: function () {
      return {
        loading: 0
      };
    },

    componentDidMount: function () {
      if (_.isArray(this.props.watch)) {
        _.each(this.props.watch, this._listenToObject, this);
      } else {
        this._listenToObject(this.props.watch);
      }
    },

    _listenToObject: function (object) {
      var incrementLoading = _.bind(this._setLoading, this, true);
      var decrementLoading = _.bind(this._setLoading, this, false);
      this.listenTo(object, "request", incrementLoading);
      this.listenTo(object, "sync error", decrementLoading);
    },

    _setLoading: function (loading) {
      if (!this.isMounted()) {
        return;
      }
      if (loading) {
        this.setState({
          loading: this.state.loading + 1
        });
      } else {
        this.setState({
          loading: Math.max(this.state.loading - 1, 0)
        });
      }
    },

    render: function () {
      var loadingIndicator = null;
      var loadingBackdrop = null;
      if (this.state.loading > 0) {
        if (this.props.backdrop) {
          loadingBackdrop = React.DOM.div({
            key: "loading-indicator-backdrop",
            className: "loading-indicator-backdrop"
          });
        }
        loadingIndicator = React.DOM.div({
          key: "loading-indicator",
          className: "loading-indicator"
        }, icon({name: this.props.icon, size: this.props.size, animate: this.props.animate}));
      }

      var className = "loading-indicator-container";
      if (this.props.className && this.props.className.length > 0) {
        className += " " + this.props.className;
      }

      var toAdd = (this.props.hideWhileLoading && this.state.loading > 0) ? [] : this.props.children;
      return React.DOM.div(_.extend({}, this.props, {
        className: className
      }), _.addToArray(toAdd, [loadingBackdrop, loadingIndicator]));
    }
  });
});