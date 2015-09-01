/**
 * React Component
 */
define([ "react", "underscore", "../mixins/Collection" ], function (React, _, collection) {
  "use strict";

  var sizeUps = {
    xs: [ "sm", "md", "lg" ],
    sm: [ "md", "lg" ],
    md: [ "lg" ],
    lg: []
  };
  var sizes = _.keys(sizeUps);
  var validSizes = React.PropTypes.oneOf([ 1, 2, 3, 4, 6, 12 ]);

  return _.rf({
    displayName: "Rows Collection",

    mixins: [ collection, React.addons.PureRenderMixin ],

    propTypes: {
      xs: validSizes, sm: validSizes, md: validSizes, lg: validSizes
    },

    getDefaultProps: function () {
      return {
        xs: null, sm: null, md: null, lg: null
      };
    },

    wrapComponent: function (className, oneComponent) {
      return React.DOM.div({
        className: className,
        key: "col-" + oneComponent.key
      }, oneComponent);
    },

    render: function () {
      var children = null;
      if (this.state.collection.length > 0) {
        var classes = [];
        var clearEvery = [];
        for (var i = 0; i < sizes.length; i++) {
          var sz = this.props[ sizes[ i ] ];
          if (sz !== null) {
            clearEvery.push({ num: 12 / sz, size: sizes[ i ] });
            classes.push([ "col", sizes[ i ], sz ].join("-"));
          }
        }

        var clearSizes = _.pluck(clearEvery, "size");

        // put clearfixes where appropriate
        children = _.map(this.getModels(), _.partial(this.wrapComponent, classes.join(" ")));
        if (clearEvery.length > 0) {
          var newChildren = [];
          var ct = 0;
          _.each(children, function (oneChild) {
            newChildren.push(oneChild);
            var numChildren = ++ct;
            _.each(clearEvery, function (oneClear) {
              if (numChildren % oneClear.num === 0) {
                var clearFixClasses = [ "clearfix", "visible-" + oneClear.size ];
                _.some(sizeUps[ oneClear.size ], function (oneSizeUp) {
                  if (!_.contains(clearSizes, oneSizeUp)) {
                    clearFixClasses.push("visible-" + oneSizeUp);
                    return false;
                  }
                  return true;
                });
                newChildren.push(React.DOM.div({
                  className: clearFixClasses.join(" "),
                  key: [ "clearfix", ct, oneClear.size ].join("-")
                }));
              }
            });
          });
          children = newChildren;
        }
      } else {
        children = _.map(this.getModels(), function (oneC) {
          return this.wrapComponent("col-xs-12", oneC);
        }, this);
      }

      var cn = "row";
      if (typeof this.props.className === "string") {
        cn += this.props.className;
      }
      var props = _.extend(_.omit(this.props, "collection", "modelComponent", "emptyNode", "xs", "sm", "md", "lg"), {
        className: cn
      });
      return React.DOM.div(props, children);
    }
  });
});
