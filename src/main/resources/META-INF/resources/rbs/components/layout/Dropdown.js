define(["react", "underscore", "../controls/Button"], function (React, _, Button) {
  "use strict";
  var RCSST = React.createFactory(React.addons.CSSTransitionGroup);
  return _.rf({
    displayName: "Drop Menu",
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

      var className = this.props.dropup ? "dropup" : "dropdown";
      var menu = null;
      if (this.state.open) {
        className += " open";
        menu = React.DOM.ul({
          key: "meun",
          className: "dropdown-menu",
          role: "menu"
        }, this.props.children);
      }

      return React.DOM.div({
        className: className
      }, [
        dropdownButton,
        menu
        //RCSST({transitionName: "dropdown-menu-transition"}, [menu])
      ]);
    }
  });
});