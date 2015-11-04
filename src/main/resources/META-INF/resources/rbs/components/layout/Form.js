/**
 * a form element that exposes a submit function that triggers validation
 */
define([ "react", "underscore", "util", "react-dom" ], function (React, _, util, dom) {
  "use strict";

  var d = React.DOM;
  var noDisplay = { display: "none" };
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
          d.input({
            type: "submit",
            ref: "_tempSubmitBtn",
            key: "_tsb",
            style: { display: "none" }
          })
        ]);
      }

      if (this.props.autoComplete === false) {
        children = [
          d.input({ key: "_chrome_autocomplete_text", type: "text", style: noDisplay }),
          d.input({ key: "_chrome_autocomplete_pass", type: "password", style: noDisplay })
        ].concat(children);
      }

      return d.form(_.extend({}, this.props, {
        onSubmit: this.beforeSubmit
      }), children);
    },

    beforeSubmit: function (e) {
      // form submission's default action of going to the URL is always prevented
      e.preventDefault();
      e.stopPropagation();

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