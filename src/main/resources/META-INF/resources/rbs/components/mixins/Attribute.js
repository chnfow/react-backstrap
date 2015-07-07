define(["react", "underscore", "./Events", "jquery"], function (React, _, events, $) {
  "use strict";
  return React.createMixin({
    mixins: [events],

    propTypes: {
      model: React.PropTypes.object.isRequired,
      attribute: React.PropTypes.string.isRequired
    },

    componentDidMount: function () {
      var pcs = this.props.attribute.split(".");

      // for each of the pieces
      for (var i = 1; i <= pcs.length; i++) {
        var attribute = pcs.slice(0, i).join(".");
        this.listenTo(this.props.model, "change:" + attribute, this.update);
      }
    },

    // save the data in the DOM node into the model
    saveData: function (data) {
      this.props.model.set(this.props.attribute, data);
    },

    getValue: function () {
      return this.props.model.get(this.props.attribute);
    }
  });
});