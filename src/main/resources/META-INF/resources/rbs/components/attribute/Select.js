define(["react", "underscore", "../mixins/Attribute", "../mixins/Collection"],
  function (React, _, attribute, collection) {

    "use strict";

    return _.rf({

      mixins: [attribute, collection],

      propTypes: {
        valueAttribute: React.PropTypes.string,
        placeholder: React.PropTypes.string
      },

      getDefaultProps: function () {
        return {
          valueAttribute: "id"
        };
      },

      render: function () {
        var options = _.map(this.getModels(), function (oneModel) {
          // wrap all the model views in an <option></option> tag
          return React.DOM.option({
            value: oneModel.props.model.get(this.props.valueAttribute)
          }, oneModel);
        }, this);

        if (this.props.placeholder) {
          options.unshift(React.DOM.option({ value: "" }, this.props.placeholder));
        }

        // if it's null or undefined, make sure the placeholder is selected when rendered
        var value = this.getValue();
        if (value === null || typeof value === "undefined") {
          value = "";
        }

        return React.DOM.select(_.extend({}, this.props, {
          onChange: this.saveData,
          value: value,
          name: this.props.attribute
        }), options);
      }

    });
  });