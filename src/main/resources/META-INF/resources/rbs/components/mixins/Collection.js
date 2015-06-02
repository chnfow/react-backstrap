define(["react", "./Events", "underscore-extras"], function (React, events, _) {
  "use strict";
  return React.createMixin({
    mixins: [events],

    propTypes: {
      collection: React.PropTypes.object.isRequired,
      // a factory function must be passed to component to create a component for each model in the collection
      component: React.PropTypes.func.isRequired
    },

    componentWillMount: function () {
      this.listenTo(this.props.collection, "add remove reset", function () { this.forceUpdate(); });
    },

    getChildren: function () {
      return this.collection.map(function (oneModel) {
        return this.props.component({ model: oneModel });
      });
    }
  });
});