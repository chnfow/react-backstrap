/**
 * Takes a model, an attribute, and a component, and renders the value of the attribute as a child of the passed component
 * after passing it through a format function
 */
define([ "react", "underscore" ], function (React, _) {
  "use strict";

  return _.rf({
    propTypes: {
      model: React.PropTypes.object.isRequired,
      component: React.PropTypes.func.isRequired,
      attribute: React.PropTypes.string,
      formatFunction: React.PropTypes.func
    },

    getDisplayValue: function () {
      var val = this.props.model.get(this.props.attribute);
      if (typeof this.props.formatFunction === "function") {
        return this.props.formatFunction(val, this.props.model);
      }
      return val;
    },

    render: function () {
      var props = _.omit(this.props, [ "model", "component", "attribute", "formatFunction" ]);
      return this.props.component(props, this.getDisplayValue());
    }
  });
});