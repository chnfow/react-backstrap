/**
 * Renders a model representing an alert into a bootstrap alert
 */
define([ "react", "underscore", "../mixins/Model", "../layout/Alert", "util" ], function (React, _, model, alert, util) {
  "use strict";

  return util.rf({
    displayName: "Model Alert",

    mixins: [ model, React.addons.PureRenderMixin ],

    render: function () {
      return alert(this.state.model);
    }
  });
});