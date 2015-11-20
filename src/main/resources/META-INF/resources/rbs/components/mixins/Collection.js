/**
 * Copies the collection to the state when collection changes and provides a function that generates an array of components
 * from the collection and a component factory
 */
define([ "react", "./Events", "underscore", "util" ],
  function (React, events, _, util) {
    "use strict";

    return React.createMixin({
      mixins: [ events ],

      propTypes: {
        collection: React.PropTypes.object.isRequired,
        // a factory function must be passed to component to create a component for each model in the collection
        modelComponent: React.PropTypes.func,
        emptyNode: React.PropTypes.node
      },

      getDefaultProps: function () {
        return {
          emptyNode: null
        };
      },

      getInitialState: function () {
        return {
          collection: this.props.collection.toArray()
        };
      },

      componentDidMount: function () {
        this.listenTo(this.props.collection, "update reset sort sync", this.copyCollectionToState);
      },

      componentDidReceiveProps: function (prevProps, prevState) {
        if (prevProps.collection !== this.props.collection) {
          this.stopListening(prevProps.collection);
          this.listenTo(this.props.collection, "update reset sort sync", this.copyCollectionToState);
          this.copyCollectionToState();
        }
      },

      copyCollectionToState: function () {
        if (this.isMounted()) {
          this.setState({ collection: this.props.collection.toArray() });
        }
      },

      getModels: function () {
        if (this.state.collection.length > 0) {
          var i = 0;
          return _.map(this.state.collection, function (model) {
            return this.getSingleModelView(model, i++);
          }, this);
        } else {
          if (this.props.emptyNode) {
            return [ this.props.emptyNode ];
          }
        }
      },

      // returns an instance of the modelComponent for the model
      getSingleModelView: function (oneModel, index) {
        if (typeof this.props.modelComponent !== "function") {
          util.debug("Model component not passed to collection component");
          return null;
        }
        var toReturn = this.props.modelComponent({
          key: oneModel.cid,
          model: oneModel
        });
        if (typeof this.wrapperFunction === "function") {
          toReturn = this.wrapperFunction(toReturn, oneModel, index);
        }
        return toReturn;
      }

    });
  });
