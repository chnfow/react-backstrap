/**
 * Provides methods for converting an array of objects and produces the appropriate component structure for a navbar
 * () indicates optional, object structure is {text, (icon), (href), (menu: [{text, (icon), (href)}, ...])}
 */
define([ "react", "backbone", "underscore", "../layout/NavbarLink", "../layout/NavbarDropdown", "../layout/Icon",
    "../mixins/Events" ],
  function (React, Backbone, _, link, dropdown, icon, events) {
    "use strict";

    return React.createMixin({
      mixins: [ events ],

      componentDidMount: function () {
        this.listenTo(Backbone.history, "route", this.update);
      },

      buildLinks: function (linkObjectOrArray) {
        if (!_.isArray(linkObjectOrArray)) {
          if (_.isObject(linkObjectOrArray)) {
            return this._buildSingleLink(linkObjectOrArray);
          }
          return null;
        } else {
          return _.map(linkObjectOrArray, this._buildSingleLink);
        }
      },

      _buildSingleLink: function (linkObject) {
        var keys = _.keys(linkObject);
        var isDropdown = _.contains(keys, "menu");
        var isNavbarText = !_.contains(keys, "href") && !isDropdown;
        if (isNavbarText) {
          return React.DOM.p({
            key: linkObject.text,
            className: "navbar-text"
          }, [
            icon({
              key: "nav-icon",
              name: linkObject.icon
            }),
            React.DOM.span({ key: "nav-text" }, linkObject.text)
          ]);
        }
        if (isDropdown) {
          return dropdown({
            key: linkObject.text,
            icon: linkObject.icon,
            text: linkObject.text
          }, this.buildLinks(linkObject.menu));
        }
        var href = linkObject.href;
        if (href[ 0 ] !== "/") {
          href = "/" + href;
        }
        return link({
          key: (linkObject.key) || ("link-" + linkObject.href),
          icon: linkObject.icon,
          text: linkObject.text,
          href: linkObject.href,
          active: (window.location.pathname === href)
        });
      }

    });
  });