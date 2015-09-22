/**
 * Renders a model representing an alert into a bootstrap alert
 */
define([ "react", "underscore", "../mixins/Model", "../layout/Alert" ], function (React, _, model, alert) {
  "use strict";

  return _.rf({
    displayName: "Model Alert",

    mixins: [ model, React.addons.PureRenderMixin ],

    render: function () {
      return alert(this.state.model);
    }
  });
});