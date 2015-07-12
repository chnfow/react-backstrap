/**
 * React Component
 */
define([ "react", "underscore", "./Icon", "../controls/TimeoutTransitionGroup", "../mixins/OnClickOutside" ],
  function (React, _, icon, TTG, onClickOutside) {
    "use strict";

    return _.rf({
      displayName: "Navbar Dropdown",

      mixins: [ React.addons.PureRenderMixin, onClickOutside ],

      propTypes: {
        text: React.PropTypes.node.isRequired,
        icon: React.PropTypes.string.isRequired,
        open: React.PropTypes.bool
      },

      getInitialState: function () {
        return {
          open: false
        };
      },

      onClickOutside: function () {
        this.setState({
          open: false
        });
      },

      toggleOpen: function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.isMounted()) {
          this.setState({
            open: !this.state.open
          });
        }
      },

      render: function () {
        // the first child is the actual toggle button
        var toggle = React.DOM.a({
          key: "dropdown-toggle-link",
          href: "#",
          className: "dropdown-toggle",
          onClick: _.bind(this.toggleOpen, this)
        }, [
          icon({ name: this.props.icon, key: "toggle-icon" }),
          React.DOM.span({ key: "navbar-dropdown-text-label" }, this.props.text),
          React.DOM.span({ key: "caret", className: "caret" })
        ]);

        // if open is specified as a property, then use it to determine whether to show a menu
        var open = (typeof this.props.open !== "undefined") ? (this.props.open === true) : (this.state.open === true);
        var menu = null;
        // if it's open, append the dropdown menu
        if (open) {
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