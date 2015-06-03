/**
 * Renders a bootstrap grid row of model attributes in form groups
 */
define(["react", "../mixins/Model", "../mixins/FormGroup", "underscore-extras"],
  function (React, model, formGroup, _) {
    "use strict";
    return _.rf({

      mixins: [model, formGroup],

      propTypes: {
        size: React.PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"])
      },

      getDefaultProps: function () {
        return {
          size: "md"
        };
      },

      render: function () {
        var origChildren = this.getChildren();
        var children = _.map(origChildren, function (oneChildComponent) {
          var columns = oneChildComponent.props.columns || Math.floor((12 / (origChildren.length)));
          var colClass = ["col", this.props.size, columns].join("-");
          return React.DOM.div({className: colClass}, oneChildComponent);
        }, this);

        return React.DOM.div(_.extend({}, this.props, {className: "row"}), children);
      }

    });
  });