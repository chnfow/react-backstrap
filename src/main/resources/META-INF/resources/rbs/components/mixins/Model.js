define(["react", "underscore", "./Events", "jquery", "../attribute/Attributes", "../attribute/Select", "../attribute/Date"],
  function (React, _, events, $, attributes, select, date) {
    "use strict";

    var attributeComponentMap = _.extend(_.clone(attributes), {
      select: select,
      date: date
    });

    return React.createMixin({

      mixins: [events],

      propTypes: {
        model: React.PropTypes.object.isRequired,
        attributes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
      },

      // this function takes an array of model attributes and returns the resulting children from the description
      getAttributes: function () {
        return _.map(this.props.attributes, function (oneAttribute) {
          var comp = oneAttribute.component;
          var viewType;
          if (typeof comp === "string") {
            viewType = attributeComponentMap[comp.toLowerCase()];
          }
          if (typeof comp === "function") {
            viewType = comp;
          }
          if (!viewType) {
            console.error("Valid component factory not passed for model attribute", oneAttribute);
            return null;
          }
          return viewType(_.extend({}, oneAttribute, {
            key: oneAttribute.key || ("attribute-" + oneAttribute.attribute),
            model: this.props.model
          }));
        }, this);
      }

    });
  });