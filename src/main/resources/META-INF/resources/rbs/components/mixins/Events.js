define(["react", "backbone", "underscore"], function (React, Backbone, _) {
  "use strict";
  return React.createMixin({
    componentWillMount: function () {
      _.extend(this, Backbone.Events);
      this.update = _.bind(function () {
        this.forceUpdate();
      }, this);
    },

    componentWillUnmount: function () {
      this.stopListening();
    }
  });
});