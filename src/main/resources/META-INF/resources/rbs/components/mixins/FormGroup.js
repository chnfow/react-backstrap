/**
 * A mixin that provides a function for creating a form group to wrap an input
 */
define(["react", "underscore"], function (React) {
  "use strict";
  return React.createMixin({
    makeFormGroup: function (component) {
        var formGroupChildren = [];
        // add the form-control class
        var oldClass = component.props.className;
        var newClass = "form-control ";
        if (typeof oldClass === "string") {
          newClass += oldClass;
        }
        // make sure the field has an ID
        var oldId = component.props.id;
        var newId;
        if (oldId) {
          newId = oldId;
        } else {
          newId = _.randomString(10);
        }
        var newComponent = React.cloneElement(component, { className: newClass, id: newId });

        formGroupChildren.push(newComponent);
        // if the component has a label, point it at the new component
        if (newComponent.props.label) {
          formGroupChildren.unshift(React.DOM.label({ htmlFor: newComponent.props.id }, newComponent.props.label));
        }
        return React.DOM.div({ className: "form-group" }, formGroupChildren);
    }
  });
});