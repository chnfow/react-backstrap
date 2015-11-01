/**
 * React Component
 */
define([ "react", "jquery", "underscore", "./Icon", "../controls/TimeoutTransitionGroup", "../mixins/OnClickOutside",
    "../mixins/Events", "backbone", "util" ],
  function (React, $, _, icon, TTG, onClickOutside, events, Backbone, util) {
    "use strict";

    return util.rf({
      displayName: "Navbar Dropdown",

      mixins: [ React.addons.PureRenderMixin, onClickOutside, events ],

      propTypes: {
        text: React.PropTypes.node.isRequired,
        icon: React.PropTypes.string.isRequired,
        closeOnNavigate: React.PropTypes.bool
      },

      getDefaultProps: function () {
        return {
          closeOnNavigate: true
        };
      },

      componentDidMount: function () {
        if (this.props.closeOnNavigate) {
          this.listenTo(Backbone.history, "route", this.close);
        }
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

      toggleOpen: function () {
        if (this.isMounted()) {
          this.setState({
            open: !this.state.open
          });
        }
      },

      close: function () {
        if (this.isMounted()) {
          this.setState({
            open: false
          });
        }
      },

      open: function () {
        if (this.isMounted()) {
          this.setState({
            open: true
          });
        }
      },

      render: function () {
        // the first child is the actual toggle button
        var toggle = React.DOM.a({
          key: "dropdown-toggle-link",
          href: "#",
          className: "dropdown-toggle",
          onClick: this.toggleOpen
        }, [
          icon({ name: this.props.icon, key: "toggle-icon" }),
          React.DOM.span({ key: "navbar-dropdown-text-label" }, this.props.text),
          React.DOM.span({ key: "caret", className: "caret" })
        ]);

        // if open is specified as a property, then use it to determine whether to show a menu
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