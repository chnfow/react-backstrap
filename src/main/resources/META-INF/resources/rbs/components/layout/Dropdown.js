define([ "react", "react-dom", "underscore", "jquery", "../controls/Button", "../controls/TimeoutTransitionGroup", "../mixins/OnClickOutside" ],
  function (React, dom, _, $, Button, TTG, onClickOutside) {
    "use strict";

    return _.rf({
      displayName: "Dropdown Button",

      propTypes: {
        dropup: React.PropTypes.bool,
        right: React.PropTypes.bool,
        animate: React.PropTypes.bool
      },

      mixins: [ React.addons.PureRenderMixin, onClickOutside ],

      getInitialState: function () {
        return {
          open: false
        };
      },

      getDefaultProps: function () {
        return {
          dropup: false,
          right: false,
          animate: false
        };
      },

      toggleOpen: function () {
        this.setState({
          open: !this.state.open
        }, this.scrollIntoView);
      },

      scrollTo: function (x, y) {
        $("body, html").animate({
          scrollTop: y + "px",
          scrollLeft: x + "px"
        });
      },
      scrollIntoView: function () {
        if (this.state.open && this.isMounted()) {
          var menu = $(dom.findDOMNode(this.refs.mnu));
          var menuOffset = menu.offset();
          var menuTop = menuOffset.top;
          var menuLeft = menuOffset.left;
          var menuWidth = menu.outerWidth();
          var menuRight = menuLeft + menuWidth;
          var menuBottom = menuTop + menu.outerHeight();
          var windowScrollTop = $(window).scrollTop();
          var windowHeight = $(window).height();
          var windowScrollLeft = $(window).scrollLeft();
          var windowWidth = $(window).width();
          // what we'll scroll to at the end
          var scrollTop = windowScrollTop, scrollLeft = windowScrollLeft;
          if (this.props.dropup) {
            if (menuTop < windowScrollTop) {
              scrollTop = menuTop;
            }
          } else {
            if (menuBottom > (windowScrollTop + windowHeight)) {
              scrollTop = menuBottom - windowHeight;
            }
          }
          if ((windowScrollLeft + windowWidth) < menuRight) {
            scrollLeft = menuRight - windowWidth;
          }
          if (windowScrollLeft > menuLeft) {
            scrollLeft = menuLeft;
          }
          if (scrollTop !== windowScrollTop || scrollLeft !== windowScrollLeft) {
            this.scrollTo(scrollLeft, scrollTop);
          }
        }
      },

      onClickOutside: function () {
        this.setState({
          open: false
        });
      },

      render: function () {
        var dropdownButton = Button(_.extend({}, this.props, {
            onClick: this.toggleOpen,
            key: "dropdownButton"
          }),
          React.DOM.span({
            key: "caret",
            className: "caret"
          })
        );

        var menu = null;
        if (this.state.open) {
          menu = React.DOM.ul({
            key: "mnu",
            ref: "mnu",
            className: "dropdown-menu" + (this.props.right ? " dropdown-menu-right" : ""),
            role: "menu",
            onClick: _.bind(this.toggleOpen, this)
          }, this.props.children);
        }

        var className = this.props.dropup ? "dropup" : "dropdown";
        return React.DOM.div({
          className: className
        }, [
          dropdownButton,
          this.props.animate ? TTG({
            key: "menuttg",
            transitionName: "flip-in-x",
            component: "div",
            leaveTimeout: 500,
            enterTimeout: 500
          }, menu) : menu
        ]);
      }
    });
  });
