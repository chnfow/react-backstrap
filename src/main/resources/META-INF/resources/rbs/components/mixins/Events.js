define(["react", "backbone", "underscore"], function (React, Backbone, _) {
  "use strict";
  return React.createMixin({
    componentWillMount: function () {
      _.extend(this, Backbone.Events);
      this.update = _.bind(function () {
        if (this.isMounted()) {
          this.forceUpdate();
        }
      }, this);
    },

    componentWillUnmount: function () {
      this.stopListening();
    }
  });
});