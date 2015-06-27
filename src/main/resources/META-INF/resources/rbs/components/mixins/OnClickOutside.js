/**
 * React Component
 */
define(["react", "underscore", "jquery"], function (React, _, $) {
  "use strict";

  return React.createMixin({
    componentDidMount: function () {
      this.__onClickOutside = _.bind(this._onClickOutside, this);
      $(document).on("click", this.__onClickOutside);
    },

    _onClickOutside: function (e) {
      if (!this.isMounted()) {
        return;
      }
      var thisNode = React.findDOMNode(this);
      var inside = thisNode === e.target || $.contains(thisNode, e.target);
      if (!inside && typeof this.onClickOutside === "function") {
        this.onClickOutside.apply(this, arguments);
      }
    },

    componentWillUnmount: function () {
      $(document).off("click", this.__onClickOutside);
    }
  });
});