/**
 * Renders a collection of models into a table body. Usually used with a table row model view
 */
define([ "react", "underscore", "../mixins/Collection", "util" ],
  function (React, _, collection, util) {
    "use strict";
    return util.rf({
      displayName: "Collection Table Body",

      mixins: [ collection, React.addons.PureRenderMixin ],

      render: function () {
        return React.DOM.tbody(_.omit(this.props, "collection", "modelComponent", "emptyNode"), this.getModels());
      }
    });
  });
