define(["react", "underscore", "../layout/Icon", "jquery"], function (React, _, icon, $) {
  "use strict";

  return _.rf({
    displayName: "Fancy Button",

    propTypes: {
      icon: React.PropTypes.string,
      caption: React.PropTypes.string,
      size: React.PropTypes.oneOf(["xs", "sm", "lg"]),
      type: React.PropTypes.string,
      ajaxButton: React.PropTypes.bool
    },

    getDefaultProps: function () {
      return {
        ajaxButton: false,
        type: "default"
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
      this.setState({
        loading: bool
      });
    },

    getIcon: function () {
      if (this.props.icon) {
        return icon({name: this.props.icon});
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

    getClassNames: function () {
      var classNames = [];
      if (this.props.className) {
        classNames.push(this.props.className);
      }
      classNames.push("btn");
      if (this.props.size) {
        classNames.push("btn-" + this.props.size);
      }
      classNames.push("btn-" + this.props.type);
      return classNames.join(" ");
    },

    render: function () {
      var caption = this.getCaption();
      var icon = this.getIcon();

      return React.DOM.button(_.extend({}, this.props, {
        onClick: this.beforeOnClick,
        className: this.getClassNames()
      }), [icon, caption]);
    }
  });

});