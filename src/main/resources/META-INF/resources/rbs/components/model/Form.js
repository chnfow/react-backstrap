/**
 * Renders a model's attributes into a form
 */
define([ "react", "react-dom", "underscore", "../mixins/Model", "../mixins/FormGroup" ],
  function (React, dom, _, model, formGroup) {
    "use strict";

    return _.rf({
      displayName: "Model Form",

      mixins: [ model, formGroup, React.addons.PureRenderMixin ],

      getInitialState: function () {
        return {
          submitting: false
        };
      },

      render: function () {
        var children = _.map(this.getAttributes(this.props.attributes), this.makeFormGroup);

        if (this.state.submitting) {
          children.push(React.DOM.input({
            type: "submit",
            ref: "_tempSubmitBtn",
            key: "_tsb",
            style: { display: "none" }
          }));
        }

        return React.DOM.form(_.extend({}, this.props, {
          onSubmit: this.beforeSubmit
        }), children);
      },

      beforeSubmit: function (e) {
        e.preventDefault();
        if (typeof this.props.onSubmit === "function") {
          this.props.onSubmit(e);
        }
      },

      submit: function () {
        if (this.isMounted()) {
          if (this.state.submitting === false) {
            this.setState({
              submitting: true
            }, function () {
              if (this.isMounted()) {
                var btn = dom.findDOMNode(this.refs._tempSubmitBtn);
                btn.click();
                this.setState({
                  submitting: false
                });
              }
            });
          }
        }
      }
    });
  });