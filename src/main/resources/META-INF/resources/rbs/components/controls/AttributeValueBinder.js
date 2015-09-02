/**
 * Binds the value of a model's attribute to the value property and the children of the component it wraps
 */
define([ "react", "underscore", "../mixins/Events" ],
  function (React, _, events) {
    "use strict";
    return _.rf({
      displayName: "Attribute Value Binder",

      propTypes: {
        model: React.PropTypes.object.isRequired,
        attribute: React.PropTypes.string,
        formatFunction: React.PropTypes.func
      },

      getDefaultProps: function () {
        return {
          attribute: null,
          formatFunction: null
        };
      },

      mixins: [ events ],

      componentDidMount: function () {
        if (this.props.attribute !== null) {
          this.listenTo(this.props.model, "change:" + this.props.attribute, this.update);
        }
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

      render: function () {
        var child = React.Children.only(this.props.children);
        var otherProps = _.omit(this.props, [ "model", "attribute", "formatFunction", "children" ]);

        return React.cloneElement(child, otherProps, this.getFormattedValue());
      }
    });
  });