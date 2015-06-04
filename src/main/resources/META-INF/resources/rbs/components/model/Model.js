define(["react", "../mixins/Model", "underscore"], function (React, model, _) {
  "use strict";

  return _.rf({
      mixins: [model],
      render: function () {
        return React.DOM.div(_.extend({}, this.props), this.getAttributes());
      }
    });
});