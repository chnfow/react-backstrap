define(["react", "./Events", "jquery"], function (React, events, $) {
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
        this.listenTo(this.props.model, "change:" + attribute, function () {
          this.forceUpdate();
        });
      }
    },

    saveData: function () {
      this.props.model.set($(React.findDOMNode(this)).formData());
    },

    getValue: function () {
      return this.props.model.get(this.props.attribute);
    }
  });
});