/**
 * React Component renders a bootstrap navbar
 */
define([ "react", "jquery", "underscore", "./Icon", "backbone", "../mixins/Events", "../controls/TimeoutTransitionGroup" ],
  function (React, $, _, icon, Backbone, events, TTG) {
    "use strict";

    return _.rf({
      displayName: "Navbar",

      mixins: [ events ],

      propTypes: {
        brand: React.PropTypes.node.isRequired,
        collapseOnNavigate: React.PropTypes.bool
      },

      getDefaultProps: function () {
        return {
          fullWidth: true,
          inverse: false,
          static: true,
          collapseOnNavigate: true
        };
      },

      getInitialState: function () {
        return {
          open: false
        };
      },

      componentDidMount: function () {
        if (this.props.collapseOnNavigate) {
          this.listenTo(Backbone.history, "route", _.bind(this.setOpen, this, false));
        }
      },

      setOpen: function (open) {
        if (this.isMounted()) {
          this.setState({
            open: open
          });
        }
      },

      render: function () {
        var navbarHeader = React.DOM.div({
          className: "navbar-header",
          key: "navbar-header"
        }, [
          React.DOM.button({
            key: "navbar-toggle-collapsed",
            className: "navbar-toggle",
            onClick: _.bind(this.setOpen, this, !this.state.open)
          }, icon({ name: "bars" })),
          React.DOM.a({
            key: "brand",
            className: "navbar-brand",
            href: "//" + window.location.host
          }, this.props.brand)
        ]);

        // this is the collapsible navbar-it only displays on xs screens
        var navbarLinks = null;
        if (this.state.open) {
          navbarLinks = React.DOM.div({
            className: "navbar-collapse in visible-xs",
            key: "navbar-links-collapsible"
          }, [
            this.props.children
          ]);
        }

        // this is the same navbar, but it displays regardless of the collapsed state on screens larger than xs
        var alwaysShowLinks = React.DOM.div({
          className: "navbar-collapse in hidden-xs",
          key: "navbar-links-always"
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
          TTG({
            key: "ttg",
            transitionName: "slide-down",
            enterTimeout: 250,
            leaveTimeout: 250
          }, navbarLinks),
          alwaysShowLinks
        ]));
      }
    });
  });
