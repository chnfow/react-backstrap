/**
 *
 */
define([ "react", "jquery", "underscore", "../controls/TimeoutTransitionGroup", "../layout/Icon", "util", "raf" ],
  function (React, $, _, TTG, icon, util) {
    "use strict";

    var rpt = React.PropTypes;
    var d = React.DOM;
    var isSafari = navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1;

    // renders an icon with the name property
    return util.rf({
      displayName: "Modal",

      mixins: [ React.addons.PureRenderMixin ],

      propTypes: {
        open: rpt.bool.isRequired,
        onClose: rpt.func,
        showClose: rpt.bool,
        size: rpt.oneOf([ "lg", "sm" ]),
        backdrop: rpt.oneOfType([ rpt.string, rpt.bool ]),
        title: rpt.string.isRequired
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
          var st;
          var body = $("body");
          if (nextProps.open && !this.props.open) {
            st = $(window).scrollTop();
            body.addClass("modal-open").css("top", st * -1);
          } else if (!nextProps.open && this.props.open) {
            st = parseInt(body.css("top")) * -1;
            body.removeClass("modal-open").css("top", "");
            if (!isNaN(st)) {
              window.requestAnimationFrame(function () {
                $(window).scrollTop(st);
              });
            }
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
            d.div({
              key: "modal-header",
              className: "modal-header"
            }, d.h4({ className: "modal-title" }, [
              (this.props.showClose) ? d.button({
                type: "button",
                key: "b",
                className: "close",
                ariaLabel: "Close",
                onClick: this.close
              }, d.span({ ariaHidden: true }, icon({ name: "times" }))) : null,
              this.props.title
            ]))
          ];
          if (this.props.children) {
            contentChildren = util.addToArray(contentChildren, this.props.children);
          }
          var dialog = d.div({
              className: "modal-dialog" + modalSizeClass
            },
            d.div({
              className: "modal-content"
            }, contentChildren)
          );
          modal = d.div({
            key: "modal",
            className: "modal"
          }, dialog);
          if (this.props.backdrop !== false) {
            backdrop = d.div({
              key: "backdrop",
              className: "Modal-backdrop",
              onClick: this.closeOnClick
            });
          }
        }

        // disable animation because of painting bugs
        if (isSafari) {
          if (this.props.open) {
            var body = $("body");
            window.requestAnimationFrame(function () {
              body.css("display", "none");
              window.requestAnimationFrame(function () {
                body.css("display", "");
              });
            });
          }
          return d.div({}, [
            backdrop,
            modal
          ]);
        }

        return d.div({}, [
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
            transitionName: "appear-from-top",
            enterTimeout: 300,
            leaveTimeout: 300
          }, modal)
        ]);
      }
    });
  });
