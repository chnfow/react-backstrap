define(["react", "underscore", "../controls/Button", "../controls/TimeoutTransitionGroup"],
  function (React, _, Button, TTG) {
    "use strict";

    return _.rf({
      displayName: "Dropdown Button",

      propTypes: {
        dropup: React.PropTypes.bool
      },

      getInitialState: function () {
        return {
          open: false
        };
      },

      getDefaultProps: function () {
        return {
          dropup: false
        };
      },

      toggleOpen: function () {
        this.setState({
          open: !this.state.open
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
            className: "dropdown-menu",
            role: "menu"
          }, this.props.children);
        }

        var className = this.props.dropup ? "dropup" : "dropdown";
        return React.DOM.div({
          className: className
        }, [
          dropdownButton,
          TTG({
            key: "menuttg",
            transitionName: "flip-in-x",
            component: "div",
            leaveTimeout: 500,
            enterTimeout: 500
          }, menu)
        ]);
      }
    });
  });