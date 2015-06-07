/**
 * Represent a model in a <form></form>
 */
define(["react", "../mixins/Model", "../mixins/FormGroup", "underscore"], function (React, model, formGroup, _) {
  "use strict";

  return _.rf({
    displayName: "Model Form",
    mixins: [model, formGroup],
    render: function () {
      var children = _.map(this.getAttributes(), this.makeFormGroup);

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