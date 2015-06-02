define(["react"], function (React) {
  "use strict";

  // renders an icon with the name property
  return React.createFactory(
    React.createClass({
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
          classes.push("glyphicon-" + name);
        }
        if (this.props.className) {
          classes.push(this.props.className);
        }
        return React.DOM.span({
          className: classes.join(" ")
        });
      }
    })
  );
});