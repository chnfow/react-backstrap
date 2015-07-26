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
        modelComponent: React.PropTypes.func,
        emptyNode: React.PropTypes.node
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
        if (this.state.collection.length > 0) {
          return _.map(this.state.collection, this.getSingleModelView, this);
        } else {
          if (this.props.emptyNode) {
            return [ this.props.emptyNode ];
          }
        }
      },

      // returns an instance of the modelComponent for the model
      getSingleModelView: function (oneModel) {
        if (typeof this.props.modelComponent !== "function") {
          _.debug("Model component not passed to collection component");
          return null;
        }
        return this.props.modelComponent({
          key: oneModel.cid,
          model: oneModel
        });
      }

    });
  });