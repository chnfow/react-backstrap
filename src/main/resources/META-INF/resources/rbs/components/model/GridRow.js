/**
 * Renders a bootstrap grid row of model attributes in form groups
 */
define([ "react", "../mixins/Model", "../mixins/FormGroup", "underscore", "util" ],
  function (React, model, formGroup, _, util) {
    "use strict";
    var bsSizes = [ "xs", "sm", "md", "lg" ];

    return util.rf({
      displayName: "Model Grid Row",

      mixins: [ model, React.addons.PureRenderMixin ],

      wrapperFunction: function (component, attribute, index) {
        var fg = formGroup.wrapperFunction.apply(this, arguments);
        var classes = [];
        _.each(bsSizes, function (oneSize) {
          var nm = attribute[ oneSize ];
          if (typeof nm === "number") {
            classes.push([ "col", oneSize, nm ].join("-"));
          }
        });
        return React.DOM.div({ key: ("col-" + index), className: classes.join(" ") }, fg);
      },

      render: function () {
        var children = this.getAttributes(this.props.attributes);

        return React.DOM.div(_.extend({}, this.props, { className: "row" }), children);
      }

    });
  });