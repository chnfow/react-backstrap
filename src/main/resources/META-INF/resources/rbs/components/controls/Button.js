/**
 * Returns a bootstrap button that prevents double clicks (with a clickDelay attribute that indicates the minimum amount
 * of time that should pass before another onClick call.)
 * Also can be disabled automatically when jquery $.ajax is used
 */
define([ "react", "underscore", "../layout/Icon", "jquery", "util" ], function (React, _, icon, $, util) {
  "use strict";

  var rpt = React.PropTypes;
  var d = React.DOM;

  return util.rf({
    displayName: "RBS Button",

    mixins: [ React.addons.PureRenderMixin ],

    propTypes: {
      icon: rpt.oneOfType([ rpt.string, rpt.node ]),
      caption: rpt.node,
      loadingCaption: rpt.node,
      size: rpt.oneOf([ "xs", "sm", "lg" ]),
      block: rpt.bool,
      type: rpt.string,
      ajax: rpt.bool,
      submit: rpt.bool,
      // minimum delay between onClick firings in milliseconds
      clickDelay: rpt.number
    },

    getDefaultProps: function () {
      return {
        icon: null,
        caption: null,
        loadingCaption: null,
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
      this._toLoading = _.bind(this.setLoading, this, true);
      this._fromLoading = _.bind(this.setLoading, this, false);

      if (this.props.ajax) {
        this.bindAjax();
      }
    },

    bindAjax: function () {
      $(document).ajaxStart(this._toLoading);
      $(document).ajaxStop(this._fromLoading);
    },

    unbindAjax: function () {
      $(document).off("ajaxStart", this._toLoading);
      $(document).off("ajaxStop", this._fromLoading);
    },

    componentDidUpdate: function (prevProps, prevState) {
      if (prevProps.ajax && !this.props.ajax) {
        this.unbindAjax();
      } else if (!prevProps.ajax && this.props.ajax) {
        this.bindAjax();
      }
    },

    componentWillUnmount: function () {
      this.unbindAjax();
    },

    setLoading: function (bool) {
      if (this.isMounted()) {
        this.setState({
          loading: bool
        });
      }
    },

    getIcon: function () {
      if (this.props.icon === null) {
        return null;
      }
      if (typeof this.props.icon === "string") {
        return icon({ key: "icon", name: this.props.icon });
      }
      return this.props.icon;
    },

    getCaption: function () {
      if (this.props.caption === null) {
        return null;
      }
      if (this.state.loading && this.state.loadingCaption !== null) {
        return d.span({ key: "caption" }, this.props.loadingCaption);
      }
      return d.span({ key: "caption" }, this.props.caption);
    },

    getNow: function () {
      return (new Date()).getTime();
    },

    beforeOnClick: function (e) {
      // if this isn't a submit button, then prevent the default action of submitting the form
      if (e && !this.props.submit && typeof this.props.href !== "string") {
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
      if (typeof this.props.className === "string") {
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

      var factory = d.button;
      if (typeof this.props.href === "string") {
        factory = d.a;
      }
      var properties = _.extend({}, this.props, {
        onClick: this.beforeOnClick,
        className: this.getClassNames(),
        disabled: this.props.disabled || this.state.loading,
        type: (this.props.submit) ? "submit" : "button"
      });
      properties = _.omit(properties, [ "icon", "caption", "block", "size", "ajax", "submit", "clickDelay" ]);

      return factory(properties, children);
    }
  });

});
