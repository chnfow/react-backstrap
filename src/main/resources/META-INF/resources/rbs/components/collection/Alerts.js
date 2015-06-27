/**
 * React Component
 */
define(["react", "underscore", "backbone", "../mixins/Events", "../model/Alert", "./Collection"],
  function (React, _, Backbone, events, alert, collection) {
    "use strict";

    return _.rf({
      mixins: [events, React.addons.PureRenderMixin],

      propTypes: {
        watch: React.PropTypes.object.isRequired,
        successMessage: React.PropTypes.string,
        parseErrors: React.PropTypes.func,
        showSuccess: React.PropTypes.bool
      },

      getDefaultProps: function () {
        return {
          showSuccess: true,
          successMessage: "Request successfully processed.",
          defaults: {
            icon: "exclamation-triangle",
            level: "warning",
            strong: "Error!",
            message: "Failure to process request."
          },
          // take the response, model, collection, etc. and parse it into an array of objects representing alerts
          parseErrors: function (model_or_collection, resp, options) {
            var errors = [];
            // server gave us some json to work with
            var json = (resp && resp.responseJSON) ? resp.responseJSON : null;
            if (json) {
              if (_.isArray(json)) {
                errors = json;
              } else {
                if (typeof json === "object") {
                  errors = [json];
                }
              }
            }
            return errors;
          }
        };
      },

      getInitialState: function () {
        return {
          errors: new Backbone.Collection()
        };
      },

      componentDidMount: function () {
        this.listenTo(this.props.watch, "request", this.clearErrors);
        this.listenTo(this.props.watch, "sync", this.showSuccess);
        this.listenTo(this.props.watch, "error", this.showErrors);
      },

      showErrors: function (model_or_collection, resp, options) {
        var errors = this.props.parseErrors.apply(this, arguments);
        this.state.errors.set(this.setDefaults(errors));
      },

      showSuccess: function () {
        if (!this.props.showSuccess) {
          this.clearErrors();
          return;
        }
        this.state.errors.set({
          id: "success",
          icon: "check",
          level: "success",
          strong: "Success!",
          message: this.props.successMessage
        });
      },

      clearErrors: function () {
        this.state.errors.reset();
      },

      setDefaults: function (errors) {
        return _.map(errors, _.partial(_.defaults, _, this.props.defaults));
      },

      render: function () {
        return collection(_.extend({}, this.props, {
          modelComponent: alert,
          collection: this.state.errors
        }));
      }
    });
  });