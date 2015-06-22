/**
 * React Component renders a bootstrap navbar
 */
define(["react", "underscore", "./Icon"],
  function (React, _, icon) {
    "use strict";

    return _.rf({
      displayName: "Navbar",

      propTypes: {
        brand: React.PropTypes.node.isRequired
      },

      getDefaultProps: function () {
        return {
          fullWidth: true,
          inverse: false,
          static: true
        };
      },

      getInitialState: function () {
        return {
          collapsed: true
        };
      },

      toggleCollapsed: function () {
        this.setState({
          collapsed: !this.state.collapsed
        });
      },

      render: function () {
        var navbarHeader = React.DOM.div({
          className: "navbar-header",
          key: "navbar-header"
        }, [
          React.DOM.button({
            key: "navbar-toggle-collapsed",
            className: "navbar-toggle" + (this.state.collapsed ? " collapsed" : ""),
            onClick: _.bind(this.toggleCollapsed, this)
          }, icon({name: "menu-hamburger"})),
          React.DOM.a({
            key: "brand",
            className: "navbar-brand",
            href: "//" + window.location.host
          }, this.props.brand)
        ]);

        var navbarLinks = React.DOM.div({
          className: "navbar-collapse collapse" + (this.state.collapsed ? "" : " in"),
          key: "navbar-links"
        }, [
          this.props.children
        ]);

        var className = "navbar" +
          (this.props.inverse ? " navbar-inverse" : " navbar-default") +
          (this.props.static ? " navbar-static-top" : "");
        if (this.props.className) {
          className += " " + this.props.className;
        }

        return React.DOM.nav(_.extend({}, this.props, {
          className: className
        }), React.DOM.div({
          className: "container" + (this.props.fullWidth ? "-fluid" : "")
        }, [
          navbarHeader,
          navbarLinks
        ]));
      }
    });
  });