/**
 * React Component
 */
define(["react", "underscore", "./Model"], function (React, _, model) {
  "use strict";

  return _.rf({
    componentDidUpdate: function () {
      this.listenTo(this.props.model, "change:level", this.update);
    },

    render: function () {
      var level = this.props.model.get("level");
      if (!level) {
        level = "info";
      }
      var className = "alert alert-" + level;
      if (this.props.className) {
        className += " " + this.props.className;
      }
      return model(_.extend({}, this.props, {
        className: className,
        role: "alert",
        attributes: [
          {
            attribute: "icon",
            component: "icon"
          },
          {
            attribute: "strong",
            component: "strong"
          },
          {
            attribute: "message",
            component: "span"
          }
        ]
      }));
    }
  });
});