/**
 * Draws an icon that spins to indicate an element is loading, and optionally a backdrop over the element to prevent
 * user interaction until the element is done loading all the data
 */
define([ "react", "underscore", "../mixins/Events", "../layout/Icon" ], function (React, _, events, icon) {
  "use strict";

  var rpt = React.PropTypes;

  return _.rf({
    displayName: "Loading Wrapper",

    mixins: [ events, React.addons.PureRenderMixin ],

    propTypes: {
      watch: rpt.oneOfType([
        rpt.arrayOf(rpt.object),
        rpt.object
      ]),
      icon: rpt.string,
      animate: rpt.string,
      size: rpt.string,
      backdrop: rpt.bool,
      hideWhileLoading: rpt.bool,
      loading: rpt.bool
    },

    getDefaultProps: function () {
      return {
        watch: null,
        icon: "refresh",
        animate: "spin",
        size: "3x",
        backdrop: false,
        hideWhileLoading: false
      };
    },

    getInitialState: function () {
      return {
        loading: false
      };
    },

    componentDidMount: function () {
      if (this.props.watch !== null) {
        if (_.isArray(this.props.watch)) {
          _.each(this.props.watch, this._listenToObject, this);
        } else {
          this._listenToObject(this.props.watch);
        }
      }
    },


    componentWillReceiveProps: function (nextProps) {
      if (nextProps !== this.props.watch) {
        if (this.props.watch !== null) {
          // stop listening to all the existing watched objects
          if (_.isArray(this.props.watch)) {
            _.each(this.props.watch, _.bind(this.stopListening, this));
          } else {
            this.stopListening(this.props.watch);
          }
          // clear the counter
          this._loadingCounter = 0;
          // listen to the next watched objects
          if (nextProps.watch !== null) {
            if (_.isArray(nextProps.watch)) {
              _.each(nextProps.watch, this._listenToObject, this);
            } else {
              this._listenToObject(nextProps.watch);
            }
          }
        }
      }
    },

    _listenToObject: function (object) {
      var incrementLoading = _.bind(this._setLoading, this, true);
      var decrementLoading = _.bind(this._setLoading, this, false);
      this.listenTo(object, "request", incrementLoading);
      this.listenTo(object, "sync error", decrementLoading);
    },

    _setLoading: function (loading) {
      if (typeof this._loadingCounter !== "number") {
        this._loadingCounter = 0;
      }
      if (loading) {
        this._loadingCounter = this._loadingCounter + 1;
        this.setState({
          loading: this._loadingCounter > 0
        });
      } else {
        this._loadingCounter = Math.max(this._loadingCounter - 1, 0);
        this.setState({
          loading: this._loadingCounter > 0
        });
      }
    },

    render: function () {
      var loadingIndicator = null;
      var loadingBackdrop = null;
      if (this.state.loading || this.props.loading) {
        if (this.props.backdrop) {
          loadingBackdrop = React.DOM.div({
            key: "loading-indicator-backdrop",
            className: "loading-indicator-backdrop"
          });
        }
        loadingIndicator = React.DOM.div({
          key: "loading-indicator",
          className: "loading-indicator"
        }, icon({ name: this.props.icon, size: this.props.size, animate: this.props.animate }));
      }

      var className = "loading-indicator-container";
      if (typeof this.props.className === "string") {
        className += " " + this.props.className;
      }

      var toAdd = (this.props.hideWhileLoading && this.state.loading) ? [] : this.props.children;
      return React.DOM.div(_.extend({}, this.props, {
        className: className
      }), _.addToArray(toAdd, [ loadingBackdrop, loadingIndicator ]));
    }
  });
});
