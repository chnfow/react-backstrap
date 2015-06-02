/**
 * All the attribute views that render a single attribute of a model in some way - since these are relatively simple
 * in that they just implement two way binding to a model's attribute, they are grouped in a single file
 */
define(["react", "../mixins/Attribute", "../layout/Icon", "underscore-extras"], function (React, attribute, icon, _) {
  "use strict";

  var exports = {};

  // generic input view
  var input = _.rf({
    mixins: [attribute],
    render: function () {
      return React.DOM.input(_.extend({}, this.props, {
        value: this.getValue(),
        onChange: this.saveData
      }));
    }
  });

  exports.input = input;

  // different versions of the input view
  exports.text = _.rf({
    render: function () {
      return input(_.extend({}, this.props, {type: "text"}));
    }
  });

  exports.number = _.rf({
    mixins: [attribute],
    render: function () {
      return input(_.extend({}, this.props, {type: "number"}));
    }
  });

  exports.email = _.rf({
    render: function () {
      return input(_.extend({}, this.props, {type: "email"}));
    }
  });

  exports.password = _.rf({
    render: function () {
      return input(_.extend({}, this.props, {type: "password"}));
    }
  });

  exports.checkbox = _.rf({
    mixins: [attribute],
    render: function () {
      return React.DOM.input(_.extend({}, this.props, {
        type: "checkbox",
        value: Boolean(this.getValue()),
        onChange: this.saveData
      }));
    }
  });

  exports.textarea = _.rf({
    mixins: [attribute],
    render: function () {
      return React.DOM.textarea(_.extend({}, this.props, {
        value: this.getValue(),
        onChange: this.saveData
      }));
    }
  });

  // these views are all static

  // renders an anchor with a dynamic href
  exports.anchor = _.rf({
    mixins: [attribute],
    propTypes: {
      href: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func])
    },
    getLink: function () {
      if (typeof this.props.href === "string") {
        return this.props.href;
      }
      if (typeof this.props.href === "function") {
        return this.props.href.call(this, this.props.model);
      }
      return null;
    },
    render: function () {
      return React.DOM.a(_.extend({}, this.props, {
        href: this.getLink()
      }), this.getValue());
    }
  });

  // renders an attribute as an icon
  exports.icon = _.rf({
    mixins: [attribute],
    render: function () {
      return icon({
        name: this.getValue()
      });
    }
  });

  //create views that just render the property as a child
  var staticViews = ["span", "div", "h1", "h2", "h3", "h4", "h5"];
  _.each(staticViews, function (type) {
    exports[type] = _.rf({
      mixins: [attribute],
      render: function () {
        return React.DOM[type](_.extend({}, this.props), this.getValue());
      }
    });
  });

  return exports;
});