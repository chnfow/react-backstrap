/**
 * Renders a model representing an alert into a bootstrap alert
 */
define([ "react", "underscore", "../mixins/Model" ], function (React, _, model) {
  "use strict";

  var defaultAttributes = [
    {
      key: "icon",
      attribute: "icon",
      component: "icon"
    },
    {
      key: "strong",
      attribute: "strong",
      component: React.DOM.strong
    },
    {
      key: "message",
      attribute: "message",
      component: React.DOM.span
    }
  ];

  return _.rf({
    displayName: "Model Alert",

    getDefaultProps: function () {
      return {
        attributes: defaultAttributes
      };
    },

    mixins: [ model, React.addons.PureRenderMixin ],

    render: function () {
      var cn = [ "alert" ];

      if (this.state.model.level) {
        cn.push("alert-" + this.state.model.level);
      } else {
        cn.push("alert-info");
      }

      if (typeof this.props.className === "string") {
        cn.push(this.props.className);
      }

      return React.DOM.div(_.extend({}, this.props, {
        className: cn.join(" "),
        role: "alert"
      }), this.getAttributes(this.props.attributes));
    }
  });
});