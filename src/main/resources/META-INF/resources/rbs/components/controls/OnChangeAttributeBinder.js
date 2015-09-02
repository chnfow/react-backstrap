/**
 * Clones the child component with an onchange event that modifies the value of a model's attribute
 */
define([ "react", "underscore" ],
  function (React, _) {
    "use strict";
    return _.rf({
      displayName: "Attribute OnChange Binder",

      propTypes: {
        model: React.PropTypes.object.isRequired,
        attribute: React.PropTypes.string
      },

      getDefaultProps: function () {
        return {
          attribute: null
        };
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
        var child = React.Children.only(this.props.children);
        var otherProps = _.omit(this.props, "model", "attribute", "children");

        return React.cloneElement(child, _.extend(otherProps, { onChange: this.handleChange }));
      }
    });
  });