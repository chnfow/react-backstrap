/**
 * Copies the collection to the state when collection changes and provides a function that generates an array of components
 * from the collection and a component factory
 */
define([ "react", "./Events", "underscore" ],
  function (React, events, _) {
    "use strict";

    return React.createMixin({
      mixins: [ events ],

      propTypes: {
        collection: React.PropTypes.object.isRequired,
        // a factory function must be passed to component to create a component for each model in the collection
        modelComponent: React.PropTypes.func.isRequired
      },

      getInitialState: function () {
        return {
          collection: this.props.collection.toArray()
        };
      },

      componentWillMount: function () {
        this.listenTo(this.props.collection, "update reset sort sync", this.copyCollectionToState);
      },

      copyCollectionToState: function () {
        if (this.isMounted()) {
          this.setState({ collection: this.props.collection.toArray() });
        }
      },

      getModels: function () {
        return _.map(this.state.collection, this.getSingleComponentView, this);
      },

      // returns an instance of the modelComponent for the model
      getSingleComponentView: function (oneModel) {
        return this.props.modelComponent({
          key: oneModel.cid,
          model: oneModel
        });
      }

    });
  });