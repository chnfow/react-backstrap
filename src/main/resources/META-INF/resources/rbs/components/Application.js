define(["react", "underscore"], function (React, _) {
  "use strict";

  var RCSST = React.addons.CSSTransitionGroup;

  return _.rf({
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