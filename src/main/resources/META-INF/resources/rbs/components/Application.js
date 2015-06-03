define(["react", "underscore-extras"], function (React, _) {
  "use strict";

  return _.rf({
    propTypes: {

    },

    getInitialState: function () {

    },
    
    getDefaultProps: function () {
      return {

      };
    },

    render: function () {
      var children = [];
      return React.DOM.body(_.extend({}, this.props), children);
    }
  });
});