/**
 * Renders a collection as the children of the passed in component, or a div by default
 */
define(["react", "underscore", "../mixins/Collection"], function (React, _, collection) {
  "use strict";

  return _.rf({
    displayName: "Generic Collection View",

    mixins: [collection],

    propTypes: {
      component: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.func
      ])
    },

    getDefaultProps: function () {
      return {
        component: "div"
      };
    },

    render: function () {
      var containerType;
      // string passed
      if (typeof this.props.component === "string") {
        if (!containerType) {
          containerType = React.DOM[this.props.component];
        }
      }
      // factory passed
      if (typeof this.props.component === "function") {
        containerType = this.props.component;
      }
      return containerType(_.extend({}, this.props), this.getModels());
    }
  });

});