/**
 * Mixin providing backbone event support, to allow listening to models, etc.
 */
define([ "react", "backbone", "underscore" ], function (React, Backbone, _) {
  "use strict";
  return React.createMixin({
    componentWillMount: function () {
      _.extend(this, Backbone.Events);
      // a helper function to call this.forceUpdate
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