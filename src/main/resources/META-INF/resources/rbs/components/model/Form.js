/**
 * Renders a model's attributes into a form
 */
define([ "react", "react-dom", "underscore", "../mixins/Model", "../mixins/FormGroup", "../layout/Form", "util" ],
  function (React, dom, _, model, formGroup, form, util) {
    "use strict";

    return util.rf({
      displayName: "Model Form",

      mixins: [ model, formGroup, React.addons.PureRenderMixin ],

      render: function () {
        return form(_.extend({ ref: "_form" }, this.props), this.getAttributes(this.props.attributes));
      },

      submit: function () {
        this.refs._form.submit();
      }
    });
  });