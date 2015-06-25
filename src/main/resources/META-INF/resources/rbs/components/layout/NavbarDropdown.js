/**
 * React Component
 */
define(["react", "underscore", "./Icon", "../controls/TimeoutTransitionGroup"],
  function (React, _, icon, TTG) {
    "use strict";

    return _.rf({
      displayName: "Navbar Dropdown",

      propTypes: {
        text: React.PropTypes.node.isRequired,
        icon: React.PropTypes.string.isRequired
      },

      getInitialState: function () {
        return {
          open: false
        };
      },

      toggleOpen: function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
          open: !this.state.open
        });
      },

      render: function () {
        // the first child is the actual toggle button
        var toggle = React.DOM.a({
          key: "dropdown-toggle-link",
          href: "#",
          className: "dropdown-toggle",
          onClick: _.bind(this.toggleOpen, this)
        }, [
          icon({name: this.props.icon, key: "toggle-icon"}),
          React.DOM.span({key: "navbar-dropdown-text-label"}, this.props.text),
          React.DOM.span({key: "caret", className: "caret"})
        ]);

        var menu = null;
        // if it's open, append the dropdown menu
        if (this.state.open) {
          menu = React.DOM.ul({
            key: "dropdown-menu",
            className: "dropdown-menu"
          }, this.props.children);
        }

        var className = "dropdown" + (this.state.open ? " open" : "");
        if (this.props.className) {
          className += " " + this.props.className;
        }

        return React.DOM.li({
          className: className
        }, [
          toggle,
          menu
        ]);
      }
    });
  });