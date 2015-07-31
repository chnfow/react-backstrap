/**
 * Binds the model's JSON to this.state.model
 * Also provides a method for converting an array of attribute descriptions to an array of components
 */
define([ "react", "underscore", "./Events", "../controls/AttributeBinder", "../controls/Datepicker", "../controls/Timepicker",
    "../controls/Select", "../layout/Icon" ],
  function (React, _, events, binder, datepicker, timepicker, select, icon) {
    "use strict";

    var attributeComponentMap = {};
    attributeComponentMap.date = datepicker;
    attributeComponentMap.select = select;
    attributeComponentMap.time = timepicker;
    attributeComponentMap.text = _.rf({
      render: function () {
        return React.DOM.input(_.extend({}, this.props, { type: "text" }), null);
      }
    });

    attributeComponentMap.textarea = _.rf({
      render: function () {
        return React.DOM.textarea(_.omit(this.props, "children"));
      }
    });

    attributeComponentMap.number = _.rf({
      render: function () {
        return React.DOM.input(_.extend({}, this.props, { type: "number" }), null);
      }
    });

    attributeComponentMap.email = _.rf({
      render: function () {
        return React.DOM.input(_.extend({}, this.props, { type: "email" }), null);
      }
    });

    attributeComponentMap.password = _.rf({
      render: function () {
        return React.DOM.input(_.extend({}, this.props, { type: "password" }), null);
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
        return React.DOM.input(_.omit(_.extend({}, this.props, {
          checked: Boolean(this.props.value),
          type: "checkbox",
          onChange: this.transformChangeEvent
        }), "children", "value"));
      }
    });

    attributeComponentMap.icon = _.rf({
      render: function () {
        return icon(_.extend({}, this.props, { name: this.props.value }), null);
      }
    });

    var rpt = React.PropTypes;
    return React.createMixin({

      mixins: [ events ],

      propTypes: {
        model: rpt.object.isRequired,
        attributes: rpt.arrayOf(
          rpt.shape({
            component: rpt.oneOfType([ rpt.string, rpt.func ]),
            attribute: rpt.string,
            key: rpt.string
          })
        )
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
