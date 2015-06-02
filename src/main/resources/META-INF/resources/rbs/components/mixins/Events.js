define(["react", "backbone", "underscore"], function (React, Backbone, _) {
  "use strict";
  return React.createMixin({
    componentWillMount: function () {
      _.extend(this, Backbone.Events);
    },

    componentDidUnmount: function () {
      this.stopListening();
    }
  });
});