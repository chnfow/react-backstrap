define(["react", "underscore"], function (React, _) {
  "use strict";

  // renders an icon with the name property
  return _.rf({
    displayName: "Icon",
    propTypes: {
      name: React.PropTypes.string
    },
    render: function () {
      if (!this.props.name) {
        return null;
      }
      var classes = [];
      if (this.props.name) {
        classes.push("glyphicon");
        classes.push("glyphicon-" + this.props.name);
      }
      if (this.props.className) {
        classes.push(this.props.className);
      }
      return React.DOM.span({
        className: classes.join(" ")
      });
    }
  });
});