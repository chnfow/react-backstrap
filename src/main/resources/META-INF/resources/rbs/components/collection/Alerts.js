/**
 * Watches a model or collection for errors or success, and presents the appropriate Alerts for the errors
 */
define([ "react", "underscore", "backbone", "../mixins/Events", "../model/Alert", "./Div" ],
  function (React, _, Backbone, events, alert, cDiv) {
    "use strict";

    return _.rf({
      displayName: "Alerts Collection",

      mixins: [ events ],

      propTypes: {
        watch: React.PropTypes.object.isRequired,
        successMessage: React.PropTypes.string,
        parseErrors: React.PropTypes.func,
        parseValidationErrors: React.PropTypes.func,
        showSuccess: React.PropTypes.bool
      },

      getDefaultProps: function () {
        return {
          showSuccess: true,
          scrollOnShow: true,
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
                  errors = [ json ];
                }
              }
            }
            return errors;
          },

          parseValidationErrors: function (model, error, options) {
            var errors = [];
            if (_.isArray(error)) {
              errors = error;
            } else {
              if (typeof error === "object") {
                errors = [ error ];
              } else if (typeof error === "string") {
                errors.push({
                  message: error
                });
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

      },

      listenToWatch: function (watch) {
        this.listenTo(watch, "request", this.clearErrors);
        this.listenTo(watch, "sync", this.showSuccess);
        this.listenTo(watch, "error", this.showErrors);
        this.listenTo(watch, "invalid", this.showValidationErrors);
      },

      componentWillReceiveProps: function (nextProps) {
        if (nextProps.watch !== this.props.watch) {
          this.stopListening(this.props.watch);
          this.listenToWatch(nextProps.watch);
        }
      },

      showErrors: function (model_or_collection, resp, options) {
        var errors = this.props.parseErrors.apply(this, arguments);
        this.state.errors.set(this.setDefaults(errors));
      },

      showSuccess: function (model_or_collection, resp, options) {
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

      showValidationErrors: function (model, error, options) {
        var errors = this.props.parseValidationErrors.apply(this, arguments);
        this.state.errors.set(this.setDefaults(errors));
      },

      clearErrors: function () {
        this.state.errors.reset();
      },

      setDefaults: function (errors) {
        return _.map(errors, _.partial(_.defaults, _, this.props.defaults));
      },

      render: function () {
        return cDiv(_.extend({}, this.props, {
          modelComponent: alert,
          collection: this.state.errors
        }));
      }
    });
  });
