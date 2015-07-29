/**
 * React Component
 */
define([ "react", "underscore", "../mixins/Collection" ], function (React, _, collection) {
  "use strict";

  var sizes = [ "xs", "sm", "md", "lg" ];
  var sizeUps = {
    xs: [ "sm", "md", "lg" ],
    sm: [ "md", "lg" ],
    md: [ "lg" ],
    lg: []
  };
  var validSizes = React.PropTypes.oneOf([ 1, 2, 3, 4, 6, 12 ]);

  return _.rf({
    mixins: [ collection ],

    propTypes: {
      xs: validSizes,
      sm: validSizes,
      md: validSizes,
      lg: validSizes
    },

    getDefaultProps: function () {
      return {
        xs: null, sm: null, md: null, lg: null
      };
    },

    wrapChildren: function (className, oneComponent) {
      return React.DOM.div({
        className: className,
        key: oneComponent.key
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
        children = _.map(this.getModels(), _.partial(this.wrapChildren, classes.join(" ")));
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
                newChildren.push(React.DOM.div({ className: clearFixClasses.join(" ") }));
              }
            });
          });
          children = newChildren;
        }
      } else {
        children = this.getModels();
      }

      var props = _.omit(this.props, "collection", "modelComponent", "emptyNode", "xs", "sm", "md", "lg");
      return React.DOM.div(props, children);
    }
  });
});