/**
 * React Component
 */
define([ "react", "underscore", "./Model", "../mixins/Events" ], function (React, _, model, events) {
  "use strict";

  return _.rf({
    displayName: "Model Alert",

    mixins: [ events ],

    componentDidMount: function () {
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
            key: "icon",
            attribute: "icon",
            component: "icon"
          },
          {
            key: "strong",
            attribute: "strong",
            component: "strong"
          },
          {
            key: "message",
            attribute: "message",
            component: "span"
          }
        ]
      }));
    }
  });
});