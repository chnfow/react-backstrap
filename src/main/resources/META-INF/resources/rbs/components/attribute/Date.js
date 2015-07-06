/**
 * React Component
 */
define([ "react", "underscore", "../mixins/Attribute" ], function (React, _, attribute) {
  "use strict";

  var inputType = _.supportInput("date") ? "date" : "text";

  return _.rf({
    mixins: [attribute],

    render: function () {
      if (inputType === "date") {
        return React.DOM.input(_.extend({}, this.props, {
          type: "date",
          value: this.getValue(),
          onChange: this.saveData,
          name: this.props.attribute
        }));
      }
      return null;
    }
  });
});