/**
 * Calls this.onClickOutside if a click event occurs outside of the react component
 */
define([ "react", "react-dom", "underscore", "jquery" ], function (React, dom, _, $) {
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
      var thisNode = dom.findDOMNode(this);
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