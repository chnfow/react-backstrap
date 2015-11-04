/**
 * a form element that exposes a submit function that triggers validation
 */
define([ "react", "underscore", "util" ], function (React, _, util) {
  "use strict";

  return util.rf({
    displayName: "Form",

    getInitialState: function () {
      return { submitting: false };
    },

    render: function () {
      var children = this.props.children;
      if (!_.isArray(children)) {
        children = (typeof children !== "undefined" && children != null) ? [ children ] : [];
      }

      if (this.state.submitting) {
        children = children.concat([
          React.DOM.input({
            type: "submit",
            ref: "_tempSubmitBtn",
            key: "_tsb",
            style: { display: "none" }
          })
        ]);
      }

      return React.DOM.form(_.extend({}, this.props, {
        onSubmit: this.beforeSubmit
      }), children);
    },

    beforeSubmit: function (e) {
      // form submission's default action of going to the URL is always prevented
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