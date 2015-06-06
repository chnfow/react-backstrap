define(["react", "backbone", "underscore"], function (React, Backbone, _) {
  "use strict";
  return React.createMixin({
    componentWillMount: function () {
      _.extend(this, Backbone.Events);
      this.update = _.debounce(_.bind(function () {
        this.forceUpdate();
      }, this), 10);
    },

    componentWillUnmount: function () {
      this.stopListening();
    }
  });
});