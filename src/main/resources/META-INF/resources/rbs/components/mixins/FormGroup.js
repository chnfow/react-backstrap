/**
 * A mixin that provides a function for creating a form group to wrap an input
 */
define([ "react", "underscore", "../layout/Tip" ], function (React, _, tip) {
  "use strict";
  return React.createMixin({

    //propTypes: {
    //  disableWhenLoading: React.PropTypes.bool
    //},
    //
    //getDefaultProps: function () {
    //
    //},
    //
    //componentDidMount: function () {
    //
    //},
    //
    //componentWillUnmount: function () {
    //
    //},
    //
    //getInitialState: function () {
    //  return {
    //    _formLoading: false
    //  };
    //},

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
            tip: newComponent.props.tip,
            placement: newComponent.props.placement
          }));
        }
        formGroupChildren.unshift(React.DOM.label({
          key: "attribute-label",
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