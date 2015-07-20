/**
 * Returns a bootstrap button that prevents double clicks (with a clickDelay attribute that indicates the minimum amount
 * of time that should pass before another onClick call.)
 * Also can be disabled automatically when jquery $.ajax is used
 */
define([ "react", "underscore", "../layout/Icon", "jquery" ], function (React, _, icon, $) {
  "use strict";

  return _.rf({
    displayName: "Fancy Button",

    propTypes: {
      icon: React.PropTypes.string,
      caption: React.PropTypes.string,
      size: React.PropTypes.oneOf([ "xs", "sm", "lg" ]),
      block: React.PropTypes.bool,
      type: React.PropTypes.string,
      ajax: React.PropTypes.bool,
      submit: React.PropTypes.bool,
      // milliseconds after clicking that the onclick event can again be triggered
      clickDelay: React.PropTypes.number
    },

    getDefaultProps: function () {
      return {
        ajax: false,
        block: false,
        type: "default",
        submit: false,
        clickDelay: 200
      };
    },

    getInitialState: function () {
      return {
        loading: false,
        lastClick: 0
      };
    },

    componentDidMount: function () {
      if (this.props.ajax) {
        this._toLoading = _.bind(this.setLoading, this, true);
        $(document).ajaxStart(this._toLoading);
        this._fromLoading = _.bind(this.setLoading, this, false);
        $(document).ajaxStop(this._fromLoading);
      }
    },

    componentWillUnmount: function () {
      if (this.props.ajax) {
        $(document).off("ajaxStart", this._toLoading);
        $(document).off("ajaxStop", this._fromLoading);
      }
    },

    setLoading: function (bool) {
      if (this.isMounted()) {
        this.setState({
          loading: bool
        });
      }
    },

    getIcon: function () {
      if (this.props.icon) {
        return icon({ key: "icon", name: this.props.icon });
      }
      return null;
    },

    getCaption: function () {
      var text = null;
      if (this.state.loading) {
        if (this.props.loadingCaption) {
          text = this.props.loadingCaption;
        }
      }
      if (this.props.caption) {
        text = this.props.caption;
      }
      if (text === null) {
        return null;
      }
      return React.DOM.span({ key: "caption" }, text);
    },

    getNow: function () {
      return (new Date()).getTime();
    },

    beforeOnClick: function (e) {
      if (this.props.submit === false) {
        e.preventDefault();
      }
      var now = this.getNow();
      if (now - this.state.lastClick <= this.props.clickDelay) {
        return;
      }
      if (typeof this.props.onClick === "function") {
        this.setState({
          lastClick: now
        });
        this.props.onClick.call(this, e);
      }
    },

    getClassNames: function () {
      var classNames = [ "btn" ];
      if (this.props.className) {
        classNames.push(this.props.className);
      }
      if (this.props.size) {
        classNames.push("btn-" + this.props.size);
      }
      if (this.props.block) {
        classNames.push("btn-block");
      }
      classNames.push("btn-" + this.props.type);
      return classNames.join(" ");
    },

    render: function () {
      var caption = this.getCaption();
      var icon = this.getIcon();
      var children = [ icon, caption ];
      if (this.props.children) {
        if (_.isArray(this.props.children)) {
          children = children.concat(this.props.children);
        } else {
          children.push(this.props.children);
        }
      }

      return React.DOM.button(_.extend({}, this.props, {
        onClick: this.beforeOnClick,
        className: this.getClassNames(),
        disabled: this.props.disabled || this.state.loading,
        type: (this.props.submit) ? "submit" : "button"
      }), children);
    }
  });

});