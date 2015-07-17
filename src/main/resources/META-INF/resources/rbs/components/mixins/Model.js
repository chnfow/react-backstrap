define([ "react", "underscore", "./Events", "jquery", "../attribute/Attributes", "../controls/Select", "../controls/DatePicker" ],
  function (React, _, events, $, attributes, select, date) {
    "use strict";

    var attributeComponentMap = _.extend(_.clone(attributes), {
      select: select,
      date: date
    });

    return React.createMixin({

      mixins: [ events ],

      propTypes: {
        model: React.PropTypes.object.isRequired,
        attributes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
      },

      getInitialState: function () {
        return {
          model: null
        };
      },

      // this helper function takes an array of model attributes and returns the resulting children from the description
      // of each attribute
      getAttributes: function () {
        return _.map(this.props.attributes, function (oneAttribute) {
          var comp = oneAttribute.component;
          var viewType;
          if (typeof comp === "string") {
            viewType = attributeComponentMap[ comp.toLowerCase() ];
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
      },

      // This function keeps the model JSON in sync with this.state.model
      copyModelToState: function () {
        if (this.isMounted()) {
          var model = this.props.model.toJSON();
          if (!_.isEqual(this.state.model, model)) {
            this.setState({ model: model });
          }
        }
      },

      componentDidMount: function () {
        this.listenTo(this.props.model, "change", this.copyModelToState);
      }

    });
  });