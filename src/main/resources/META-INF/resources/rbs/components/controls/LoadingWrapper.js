/**
 * React Component
 */
define(["react", "underscore", "../mixins/Events", "../layout/Icon"], function (React, _, events, icon) {
  "use strict";

  return _.rf({
    mixins: [events],
    propTypes: {
      watch: React.PropTypes.oneOfType([
        React.PropTypes.arrayOf(React.PropTypes.object),
        React.PropTypes.object
      ]).isRequired
    },

    getDefaultProps: function () {
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
        loadingBackdrop = React.DOM.div({
          key: "loading-indicator-backdrop",
          className: "loading-indicator-backdrop"
        });
        loadingIndicator = React.DOM.div({
          key: "loading-indicator",
          className: "loading-indicator"
        }, icon({name: "cog"}));
      }

      var className = "loading-indicator-container";
      if (this.props.className && this.props.className.length > 0) {
        className += " " + this.props.className;
      }

      return React.DOM.div(_.extend({}, this.props, {
        className: className
      }), _.flatten([this.props.children, loadingBackdrop, loadingIndicator]));
    }
  });
});