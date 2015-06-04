define(["react", "underscore", "../layout/Icon", "jquery"], function (React, _, icon, $) {
  "use strict";

  return _.rf({

    propTypes: {
      icon: React.PropTypes.string,
      caption: React.PropTypes.string,
      ajaxButton: React.PropTypes.bool
    },

    getDefaultProps: function () {
      return {
        ajaxButton: false
      };
    },

    getInitialState: function () {
      return {
        loading: false
      };
    },

    componentDidMount: function () {
      // prevent double-clicks
      this.beforeOnClick = _.debounce(this.beforeOnClick, 500, true);

      if (this.props.ajaxButton) {
        this.toLoading = _.bind(this.setLoading, this, true);
        $(document).ajaxStart(this.toLoading);
        this.fromLoading = _.bind(this.setLoading, this, false);
        $(document).ajaxStop(this.fromLoading);
      }
    },

    componentWillUnmount: function () {
      if (this.props.ajaxButton) {
        $(document).off("ajaxStart", this.toLoading);
        $(document).off("ajaxStop", this.fromLoading);
      }
    },

    setLoading: function (bool) {
      this.setState({ loading: bool });
    },

    getIcon: function () {
      if (this.props.icon) {
        return icon({ name: this.props.icon });
      }
      return null;
    },

    getCaption: function () {
      if (this.state.loading) {
        if (this.props.loadingCaption) {
          return this.props.loadingCaption;
        }
      }
      if (this.props.caption) {
        return this.props.caption;
      }
      return null;
    },

    beforeOnClick: function (e) {
      e.preventDefault();
      if (typeof this.props.onClick === "function") {
        this.props.onClick.call(this, e);
      }
    },

    render: function () {
      return React.DOM.button(_.extend({}, this.props, {
        onClick: this.beforeOnClick
      }), [this.getIcon(), " ", this.getCaption()]);
    }
  });

});