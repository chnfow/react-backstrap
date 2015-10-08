/**
 * We are not using bootstrap's modals because it's styling is too mixed in with the rest of the css
 */
define([ "react", "jquery", "underscore", "../controls/TimeoutTransitionGroup", "../layout/Icon" ],
  function (React, $, _, TTG, icon) {
    "use strict";

    // renders an icon with the name property
    return _.rf({
      displayName: "Modal",

      mixins: [ React.addons.PureRenderMixin ],

      propTypes: {
        open: React.PropTypes.bool.isRequired,
        onClose: React.PropTypes.func,
        showClose: React.PropTypes.bool,
        size: React.PropTypes.oneOf([ "lg", "sm" ]),
        backdrop: React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.bool ]),
        title: React.PropTypes.string.isRequired
      },

      getDefaultProps: function () {
        return {
          showClose: true,
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

      // it's up to the owner to implement onClose since they trigger the open
      close: function () {
        this.props.onClose();
      },

      componentWillReceiveProps: function (nextProps) {
        if (this.isMounted()) {
          if (nextProps.open && !this.props.open) {
            $("body").addClass("modal-open");
          } else if (!nextProps.open && this.props.open) {
            $("body").removeClass("modal-open");
          }
        }
      },

      componentWillUnmount: function () {
        if (this.props.open) {
          $("body").removeClass("modal-open");
        }
      },

      render: function () {
        var modal = null;
        var backdrop;
        if (this.props.open) {
          var modalSizeClass = (this.props.size !== null) ? (" modal-" + this.props.size) : "";
          var contentChildren = [
            React.DOM.div({
              key: "modal-header",
              className: "modal-header"
            }, React.DOM.h4({ className: "modal-title" }, [
              (this.props.showClose) ? React.DOM.button({
                type: "button",
                key: "b",
                className: "close",
                ariaLabel: "Close",
                onClick: this.close
              }, React.DOM.span({ ariaHidden: true }, icon({ name: "times" }))) : null,
              this.props.title
            ]))
          ];
          if (this.props.children) {
            contentChildren = _.addToArray(contentChildren, this.props.children);
          }
          var dialog = React.DOM.div({
              className: "modal-dialog" + modalSizeClass
            },
            React.DOM.div({
              className: "modal-content"
            }, contentChildren)
          );
          modal = React.DOM.div({
            className: "modal"
          }, dialog);
          if (this.props.backdrop !== false) {
            backdrop = React.DOM.div({
              className: "Modal-backdrop",
              onClick: this.closeOnClick
            });
          }
        }

        return React.DOM.div({}, [
          TTG({
            key: "backdrop",
            component: "div",
            transitionName: "fade",
            enterTimeout: 500,
            leaveTimeout: 500
          }, backdrop),
          TTG({
            key: "modal",
            component: "div",
            transitionName: "fade-scale",
            enterTimeout: 300,
            leaveTimeout: 300
          }, modal)
        ]);
      }
    });
  });
