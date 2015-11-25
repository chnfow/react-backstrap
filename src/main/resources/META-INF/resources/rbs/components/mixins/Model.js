/**
 * Binds the model's JSON to this.state.model
 * Also provides a method for converting an array of attribute descriptions to an array of components
 */
define([ "react", "underscore", "./Events", "../controls/AttributeBinder", "../controls/Datepicker", "../controls/Timepicker",
    "../controls/Colorpicker", "../controls/Select", "../layout/Icon", "util" ],
  function (React, _, events, binder, datepicker, timepicker, colorpicker, select, icon, util) {
    "use strict";

    var attributeComponentMap = {};
    attributeComponentMap.date = datepicker;
    attributeComponentMap.color = colorpicker;
    attributeComponentMap.select = select;
    attributeComponentMap.time = timepicker;
    attributeComponentMap.text = util.rf({
      displayName: "Text Attribute Wrapper",
      render: function () {
        return React.DOM.input(_.extend({}, this.props, { type: "text" }), null);
      }
    });

    attributeComponentMap.textarea = util.rf({
      displayName: "TextArea Attribute Wrapper",
      render: function () {
        return React.DOM.textarea(_.omit(this.props, "children"));
      }
    });

    attributeComponentMap.number = util.rf({
      displayName: "Number Attribute Wrapper",
      render: function () {
        return React.DOM.input(_.extend({}, this.props, { type: "number" }), null);
      }
    });

    attributeComponentMap.email = util.rf({
      displayName: "Email Attribute Wrapper",
      render: function () {
        return React.DOM.input(_.extend({}, this.props, { type: "email" }), null);
      }
    });

    attributeComponentMap.password = util.rf({
      displayName: "Password Attribute Wrapper",
      render: function () {
        return React.DOM.input(_.extend({}, this.props, { type: "password" }), null);
      }
    });

    attributeComponentMap.checkbox = util.rf({
      displayName: "Checkbox Attribute Wrapper",
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

    attributeComponentMap.icon = util.rf({
      displayName: "Icon Attribute Wrapper",
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
            component: rpt.oneOfType([ rpt.string, rpt.func ]).isRequired,
            attribute: rpt.string,
            key: rpt.string
          })
        )
      },

      componentDidMount: function () {
        this.listenTo(this.props.model, "sync change", this.copyModelToState);
      },

      componentDidUpdate: function (prevProps, prevstate) {
        if (prevProps.model !== this.props.model) {
          this.stopListening(prevProps.model);
          this.listenTo(this.props.model, "sync change", this.copyModelToState);
          this.copyModelToState();
        }
      },

      getInitialState: function () {
        return {
          model: this.props.model.toJSON()
        };
      },

      // this helper function takes an array of attribute descriptions and returns components for those children
      getAttributes: function (attributes) {
        var i = 0;
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
            util.debug("Valid component factory not passed for model attribute", oneAttribute);
            return null;
          }

          var toReturn = binder(_.extend({}, oneAttribute, {
            key: oneAttribute.key || ("attribute-" + oneAttribute.attribute),
            component: viewType,
            model: this.props.model
          }));

          if (typeof this.wrapperFunction === "function") {
            toReturn = this.wrapperFunction(toReturn, oneAttribute, i++);
          }
          return toReturn;
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
