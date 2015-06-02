define(["react", "underscore", "./Events", "jquery-extras", "../attribute/Attributes"], function (React, _, events, $, attributes) {
  "use strict";
  return React.createMixin({
    mixins: [events],
    propTypes: {
      model: React.PropTypes.object.isRequired,
      attributes: React.PropTypes.arrayOf(React.PropTyoes.object).isRequired
    },

    // this function takes an array of model attributes and returns the resulting children from the description
    getChildren: function () {
      return _.without(_.map(this.props.attributes, function (oneAttribute) {
        var comp = oneAttribute.component;
        var viewType;
        if (typeof comp === "string") {
          viewType = attributes[comp];
        }
        if (typeof comp === "function") {
          viewType = comp;
        }
        if (!viewType) {
          console.error("Valid component not passed for model attribute", oneAttribute);
          return null;
        }
        return viewType(_.extend({}, oneAttribute, {model: this.props.model, ref: this.props.attribute }));
      }, this), null);
    }

  });
});