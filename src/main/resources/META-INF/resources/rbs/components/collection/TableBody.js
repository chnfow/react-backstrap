/**
 * Renders a collection of models into a table body. Usually used with a table row model view
 */
define([ "react", "underscore", "../mixins/Collection" ],
  function (React, _, collection) {
    "use strict";
    return _.rf({
      displayName: "Collection Table Body",

      mixins: [ collection ],

      render: function () {
        return React.DOM.tbody(_.omit(this.props, "collection", "modelComponent", "emptyNode"), this.getModels());
      }
    });
  });
