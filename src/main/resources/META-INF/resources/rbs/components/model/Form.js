define(["react", "../mixins/Model", "underscore-extras"], function (React, model, _) {
    "use strict";
    return _.rf({
        mixins: [model],
        render: function () {
            var children = _.map(this.getChildren(), function (oneChildComponent) {
                var formGroupChildren;
                // add the form-control class
                var oldClass = oneChildComponent.props.className;
                var newClass = "form-control ";
                if (typeof oldClass === "string") {
                    newClass += oldClass;
                }
                // make sure the field has an ID
                var oldId = oneChildComponent.props.id;
                var newId;
                if (oldId) {
                    newId = oldId;
                } else {
                    newId = _.randomString(10);
                }
                var newComponent = React.cloneElement(oneChildComponent, { className: newClass, id: newId });

                formGroupChildren.push(newComponent);
                // if the component has a label, point it at the new component
                if (newComponent.props.label) {
                    formGroupChildren.shift(React.DOM.label({ htmlFor: newComponent.props.id }), newComponent.props.label);
                }
                return React.DOM.div({ className: "form-group" }, formGroupChildren);
            });

            return React.DOM.form(_.extend({}, this.props, {
                onSubmit: this.beforeSubmit
            }), children);
        },

        beforeSubmit: function (e) {
            e.preventDefault();
            if (typeof this.props.onSubmit === "function") {
                this.props.onSubmit(e);
            }
        }
    });
});