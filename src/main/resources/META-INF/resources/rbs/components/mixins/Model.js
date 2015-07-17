/**
 * Binds the model's JSON to this.state.model
 * Also provides a method for converting an array of attribute descriptions to an array of components
 */
define([ "react", "underscore", "./Events" ],
  function (React, _, events) {
    "use strict";

    return React.createMixin({

      mixins: [ events ],

      propTypes: {
        model: React.PropTypes.object.isRequired,
        attributes: React.PropTypes.arrayOf(React.PropTypes.object)
      },

      componentDidMount: function () {
        this.listenTo(this.props.model, "sync change", this.copyModelToState);
      },

      getInitialState: function () {
        return {
          model: this.props.model.toJSON()
        };
      },

      // this helper function takes an array of attribute descriptions and returns components for those children
      getAttributes: function (attributes) {
        if (!_.isArray(attributes)) {
          return [];
        }
        return _.map(attributes, function (oneAttribute) {
          var comp = oneAttribute.component;
          var viewType;
          if (typeof comp === "string") {
            viewType = attributeComponentMap[ comp.toLowerCase() ];
          }
          if (typeof comp === "function") {
            viewType = comp;
          }
          if (!viewType) {
            _.debug("Valid component factory not passed for model attribute", oneAttribute);
            return null;
          }
          return viewType(_.extend({}, oneAttribute, {
            key: oneAttribute.key || ("attribute-" + oneAttribute.attribute),
            model: this.props.model
          }));
        }, this);
      },

      // This function keeps the model JSON in sync with this.state.model
      copyModelToState: function () {
        if (this.isMounted()) {
          var model = this.props.model.toJSON();
          if (!_.isEqual(this.state.model, model)) {
            this.setState({ model: model });
          }
        }
      }

    });
  });