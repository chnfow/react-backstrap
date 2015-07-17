/**
 * Takes a model, an attribute, and a component, and renders the component with the value set to the model attribute value
 * and sets the value of that attribute on change event of the component
 * i.e. 2-way binds the value of the input to the model attribute
 */
define([ "react", "underscore" ], function (React, _) {
  "use strict";

  return _.rf({
    propTypes: {
      model: React.PropTypes.object.isRequired,
      component: React.PropTypes.func.isRequired,
      attribute: React.PropTypes.string
    },

    getValue: function () {
      return this.props.model.get(this.props.attribute);
    },

    setValue: function (value) {
      this.props.model.set(this.props.attribute, value);
    },

    clearValue: function () {
      this.props.model.unset(this.props.attribute);
    },

    handleChange: function (e_or_value) {
      if (typeof e_or_value === "undefined") {
        this.clearValue();
        return;
      }
      if (e_or_value === null) {
        this.setValue(null);
        return;
      }
      var value = e_or_value;
      // regular inputs just pass the event to onchange
      if (e_or_value && e_or_value.target && typeof e_or_value.target.value !== "undefined") {
        value = e_or_value.target.value;
      }
      this.setValue(value);
    },

    render: function () {
      var props = _.extend(_.omit(this.props, [ "model", "component", "attribute" ]), {
        value: this.getValue(),
        onChange: _.bind(this.handleChange, this)
      });
      return this.props.component(props);
    }
  });
});