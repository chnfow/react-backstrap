define(["react", "underscore"], function (React, _) {
  "use strict";

  var RCSST = React.createFactory(React.addons.CSSTransitionGroup);

  // renders an icon with the name property
  return _.rf({
    displayName: "Modal",
    propTypes: {
      open: React.PropTypes.bool.isRequired,
      onClose: React.PropTypes.func,
      size: React.PropTypes.oneOf(["lg", "sm", "md"]),
      backdrop: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool])
    },

    getDefaultProps: function () {
      return {
        size: "md",
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
      if (this.props.open) {
        var modalSize = (this.props.size !== "md") ? ("modal-" + this.props.size) : "";

        var dialog = React.DOM.div({
          key: "dialog",
          className: "modal-dialog " + modalSize
        }, [
          React.DOM.div({
            className: "modal-content"
          }, this.props.children)
        ]);

        var backdrop = null;
        if (this.props.backdrop !== false) {
          backdrop = React.DOM.div({
            key: "backdrop",
            className: "modal-backdrop",
            onClick: this.closeOnClick
          });
        }

        children.push(React.DOM.div({className: "modal"}, [backdrop, dialog]));
      }

      return RCSST({transitionName: "modal-transition"}, children);
    }
  });
});