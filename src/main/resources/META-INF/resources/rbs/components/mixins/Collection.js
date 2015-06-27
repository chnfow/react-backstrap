define(["react", "./Events", "underscore"], function (React, events, _) {
  "use strict";
  return React.createMixin({
    mixins: [events],

    propTypes: {
      collection: React.PropTypes.object.isRequired,
      // a factory function must be passed to component to create a component for each model in the collection
      modelComponent: React.PropTypes.func.isRequired
    },

    componentWillMount: function () {
      this.listenTo(this.props.collection, "update reset sort sync", this.update);
    },

    // gets the components for either the passed collection/array or the collection property
    getModels: function (collection) {
      if (collection) {
        if (_.isArray(collection)) {
          return _.map(collection, this.getSingleComponentView, this);
        }
        return collection.map(this.getSingleComponentView, this);
      }
      return this.props.collection.map(this.getSingleComponentView, this);
    },

    // takes a model and returns a single component view for that model
    getSingleComponentView: function (oneModel) {
      return this.props.modelComponent({
        key: oneModel.cid,
        model: oneModel
      });
    }

  });
});