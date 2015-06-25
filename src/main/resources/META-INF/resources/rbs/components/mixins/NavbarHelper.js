/**
 * React Component
 */
define(["react", "underscore", "../layout/NavbarLink", "../layout/NavbarDropdown", "../layout/Icon"],
  function (React, _, link, dropdown, icon) {
    "use strict";

    // provides a function that takes an object or array, and then produces the appropriate navbar dropdown
    // and links;
    // () is optional, object structure is {text, (icon), (href), (menu: [{text, (icon), (href)}, ...])}
    return React.createMixin({

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
          }, [icon({key: "nav-icon", name: linkObject.icon}), React.DOM.span({key: "nav-text"}, linkObject.text)]);
        }
        if (isDropdown) {
          return dropdown({
            key: linkObject.text,
            icon: linkObject.icon,
            text: linkObject.text
          }, this.buildLinks(linkObject.menu));
        }
        var href = linkObject.href;
        if (href[0] !== "/") {
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