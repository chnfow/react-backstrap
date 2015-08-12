/**
 * A mixin that provides a function for wrapping a component in a form group, including help text in a tip component
 * if specified in that component's attributes
 */
define([ "react", "underscore", "../layout/Tip", "../layout/Icon" ], function (React, _, tip, icon) {
  "use strict";
  return React.createMixin({
    makeFormGroup: function (component) {
      var formGroupChildren = [];
      // add the form-control class
      var oldClass = component.props.className;
      var newClass = "form-control";
      if (typeof oldClass === "string") {
        newClass += " " + oldClass;
      }
      // make sure the field has an ID
      var fieldId = component.props.id || _.randomString(5);
      var newComponent = React.cloneElement(component, {
        key: "attribute-component",
        className: newClass,
        id: fieldId
      });

      formGroupChildren.push(newComponent);
      // if the component has a label, point it at the new component
      if (newComponent.props.label) {
        if (newComponent.props.tip) {
          formGroupChildren.unshift(tip({
            key: "tip",
            tip: newComponent.props.tip
          }, icon({ name: "question-circle" })));
        }
        formGroupChildren.unshift(React.DOM.label({
          key: "attribute-label",
          className: "sm-margin-right",
          htmlFor: newComponent.props.id
        }, newComponent.props.label));
      }
      return React.DOM.div({
        key: component.key,
        className: "form-group"
      }, formGroupChildren);
    }
  });
});
