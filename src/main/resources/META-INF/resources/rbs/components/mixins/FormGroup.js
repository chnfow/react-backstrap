/**
 * A mixin that provides a function for wrapping a component in a form group, including help text in a tip component
 * if specified in that component's attributes
 */
define([ "react", "underscore", "util", "../layout/Tip", "../layout/Icon" ], function (React, _, util, tip, icon) {
  "use strict";
  return React.createMixin({
    wrapperFunction: function (component, attribute, index) {
      var formGroupChildren = [];
      // add the form-control class
      var newClass = "form-control";

      // make sure the field has an ID
      var fieldId = attribute.id || util.randomString(5);
      var newComponent = React.cloneElement(component, {
        key: "attribute-component",
        className: newClass,
        id: fieldId
      });

      formGroupChildren.push(newComponent);
      // if the component has a label, point it at the new component
      if (attribute.label) {
        if (attribute.tip) {
          formGroupChildren.unshift(tip({
            key: "tip",
            tip: attribute.tip
          }, icon({ key: "question-circle", name: "question-circle" })));
        }
        formGroupChildren.unshift(React.DOM.label({
          key: "attribute-label",
          className: "sm-margin-right",
          htmlFor: attribute.id
        }, attribute.label));
      }
      return React.DOM.div({
        key: component.key,
        className: "form-group"
      }, formGroupChildren);
    }
  });
});
