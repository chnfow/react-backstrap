define([ "react", "underscore", "../controls/Button", "../controls/TimeoutTransitionGroup", "../mixins/OnClickOutside" ],
  function (React, _, Button, TTG, onClickOutside) {
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
          animate: true
        };
      },

      toggleOpen: function () {
        this.setState({
          open: !this.state.open
        });
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
