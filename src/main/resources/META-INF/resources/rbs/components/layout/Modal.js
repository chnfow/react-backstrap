define(["react", "underscore", "../controls/TimeoutTransitionGroup"], function (React, _, TTG) {
  "use strict";

  // renders an icon with the name property
  return _.rf({
    displayName: "Modal",
    propTypes: {
      open: React.PropTypes.bool.isRequired,
      onClose: React.PropTypes.func,
      size: React.PropTypes.oneOf(["lg", "sm"]),
      backdrop: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool])
    },

    getDefaultProps: function () {
      return {
        size: null,
        backdrop: "static",
        onClose: _.noop
      };
    },

    closeOnClick: function () {
      if (this.props.backdrop === "static") {
        return;
      }
      this.close();
    },

    // it's up to the owner to actually set the open property to false since properties are immutable
    close: function () {
      this.props.onClose();
    },

    render: function () {
      var children = [];

      var dialog = null;
      var backdrop = null;
      if (this.props.open) {
        var modalSizeClass = (this.props.size !== null) ? ("modal-" + this.props.size) : "";
        dialog = React.DOM.div({className: "modal"},
          React.DOM.div({
              className: "modal-dialog " + modalSizeClass
            },
            React.DOM.div({
              key: "content",
              className: "modal-content"
            }, this.props.children)
          )
        );

        if (this.props.backdrop !== false) {
          backdrop = React.DOM.div({
            className: "popup-backdrop",
            onClick: this.closeOnClick
          });
        }
      }

      return React.DOM.div({}, [
        TTG({
          transitionName: "modal-dialog-transition",
          enterTimeout: "300",
          leaveTimeout: "300",
          key: "dialog"
        }, dialog),
        TTG({
          transitionName: "popup-backdrop-transition",
          enterTimeout: "300",
          leaveTimeout: "300",
          key: "backdrop"
        }, backdrop)
      ]);
    }
  });
});