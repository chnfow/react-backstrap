/**
 * Renders a bootstrap grid row of model attributes in form groups
 */
define([ "react", "../mixins/Model", "../mixins/FormGroup", "underscore", "util" ],
  function (React, model, formGroup, _, util) {
    "use strict";
    return util.rf({
      displayName: "Model Grid Row",
      mixins: [ model, formGroup, React.addons.PureRenderMixin ],

      propTypes: {
        size: React.PropTypes.oneOf([ "xs", "sm", "md", "lg" ])
      },

      getDefaultProps: function () {
        return {
          size: "md"
        };
      },

      render: function () {
        var origChildren = this.getAttributes(this.props.attributes);
        var i = 0;
        var children = _.map(origChildren, function (oneChildComponent) {
          var columns = oneChildComponent.props.columns || Math.floor((12 / (origChildren.length)));
          var colClass = [ "col", this.props.size, columns ].join("-");
          return React.DOM.div({ key: (i++).toString(), className: colClass }, this.makeFormGroup(oneChildComponent));
        }, this);

        return React.DOM.div(_.extend({}, this.props, { className: "row" }), children);
      }

    });
  });