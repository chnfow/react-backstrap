/**
 * Binds the model's JSON to this.state.model
 * Also provides a method for converting an array of attribute descriptions to an array of components
 */
define([ "react", "underscore", "./Events", "../controls/AttributeBinder", "../controls/Datepicker", "../controls/Select",
  "../layout/Icon"],
  function (React, _, events, binder, datepicker, select, icon) {
    "use strict";

    var attributeComponentMap = {};
    attributeComponentMap.date = datepicker;
    attributeComponentMap.select = select;
    attributeComponentMap.text = _.rf({
      render: function () {
        return React.DOM.input(_.extend({}, this.props, { type: "text" }));
      }
    });

    attributeComponentMap.number = _.rf({
      render: function () {
        return React.DOM.input(_.extend({}, this.props, { type: "number" }));
      }
    });

    attributeComponentMap.email = _.rf({
      render: function () {
        return React.DOM.input(_.extend({}, this.props, { type: "email" }));
      }
    });

    attributeComponentMap.password = _.rf({
      render: function () {
        return React.DOM.input(_.extend({}, this.props, { type: "password" }));
      }
    });

    attributeComponentMap.checkbox = _.rf({
      transformChangeEvent: function (e) {
        if (typeof this.props.onChange === "function") {
          var checked = Boolean(e.target.checked);
          this.props.onChange(checked);
        }
      },

      render: function () {
        return React.DOM.input(_.extend({}, this.props, { type: "checkbox", onChange: this.transformChangeEvent }));
      }
    });

    attributeComponentMap.icon = _.rf({
      render: function () {
        return icon(_.extend({}, this.props, { name: this.props.value }), null);
      }
    });

    return React.createMixin({

      mixins: [ events ],

      propTypes: {
        model: React.PropTypes.object.isRequired,
        attributes: React.PropTypes.arrayOf(React.PropTypes.object)
      },

      componentDidMount: function () {
        this.listenTo(this.props.model, "sync change", this.copyModelToState);
      },

      getInitialState: function () {
        return {
          model: this.props.model.toJSON()
        };
      },

      // this helper function takes an array of attribute descriptions and returns components for those children
      getAttributes: function (attributes) {
        return _.map(attributes, function (oneAttribute) {
          var comp = oneAttribute.component;
          var viewType;
          if (typeof comp === "string") {
            viewType = attributeComponentMap[ comp.toLowerCase() ];
          }
          if (typeof comp === "function") {
            viewType = comp;
          }
          if (typeof viewType !== "function") {
            _.debug("Valid component factory not passed for model attribute", oneAttribute);
            return null;
          }
          return binder(_.extend({}, oneAttribute, {
            key: oneAttribute.key || ("attribute-" + oneAttribute.attribute),
            component: viewType,
            model: this.props.model
          }));
        }, this);
      },

      // This function keeps the model JSON in sync with this.state.model
      copyModelToState: function () {
        if (this.isMounted()) {
          var model = this.props.model.toJSON();
          if (!_.isEqual(this.state.model, model)) {
            this.setState({ model: model });
          }
        }
      }

    });
  });