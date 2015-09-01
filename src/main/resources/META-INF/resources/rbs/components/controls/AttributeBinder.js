/**
 * This component binds the value of an input or span to a model's attribute
 * Note this is one-way from the DOM to the model, so changing
 */
define([ "react", "underscore" ], function (React, _) {
  "use strict";

  return _.rf({
    displayName: "Attribute Binder",

    propTypes: {
      model: React.PropTypes.object.isRequired,
      component: React.PropTypes.func.isRequired,
      formatFunction: React.PropTypes.func,
      attribute: React.PropTypes.string
    },

    // changes to the model trigger updates to the model component so we don't need to worry about
    mixins: [ React.addons.PureRenderMixin ],

    getDefaultProps: function () {
      return {
        attribute: null,
        formatFunction: null
      };
    },

    getValue: function () {
      if (this.props.attribute === null) {
        return null;
      }
      return this.props.model.get(this.props.attribute);
    },

    getFormattedValue: function () {
      if (this.props.attribute === null) {
        return null;
      }
      if (this.props.formatFunction === null) {
        return this.getValue();
      }
      return this.props.formatFunction(this.getValue());
    },

    setValue: function (value) {
      if (this.props.attribute === null) {
        return;
      }
      this.props.model.set(this.props.attribute, value);
    },

    clearValue: function () {
      if (this.props.attribute === null) {
        return;
      }
      this.props.model.unset(this.props.attribute);
    },

    handleChange: function (e_or_value) {
      if (typeof e_or_value === "undefined") {
        this.clearValue();
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
      var props = _.extend(_.omit(this.props, [ "component" ]), {
        value: this.getValue(),
        onChange: _.bind(this.handleChange, this)
      });
      return this.props.component(props, this.getFormattedValue());
    }
  });
});
