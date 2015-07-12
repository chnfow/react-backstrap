/**
 * Use this to wrap your application to provide loading indicators and transitions between screens
 */
define([ "react", "underscore" ], function (React, _) {
  "use strict";

  var RCSST = React.addons.CSSTransitionGroup;

  return _.rf({
    displayName: "Application",
    propTypes: {},

    getInitialState: function () {

    },

    getDefaultProps: function () {
      return RCSST(_.extend({}, this.props), this.props.children);
    },

    render: function () {
      var children = [];
      return React.DOM.body(_.extend({}, this.props), children);
    }
  });
});