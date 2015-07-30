/**
 *
 */
define([ "react", "underscore", "../mixins/Collection" ], function (React, _, collection) {
  "use strict";

  var rpt = React.PropTypes;

  return _.rf({
    displayName: "Collection Table",

    mixins: [ collection ],

    propTypes: {
      columns: rpt.arrayOf(rpt.shape({ label: rpt.string.isRequired, sortOn: rpt.string })).isRequired,
      striped: rpt.bool,
      condensed: rpt.bool
    },

    getDefaultProps: function () {
      return {
        striped: false,
        condensed: false
      };
    },
    getHeader: function () {
      var ths = _.map(this.props.columns, function (oneColumn) {
        return React.DOM.th({
          key: oneColumn.label,
          onClick: _.bind(this.sortCollection, this, oneColumn.sortOn)
        }, oneColumn.label);
      }, this);

      return React.DOM.thead({ key: "thead" }, ths);
    },

    sortCollection: function (on) {
      if (typeof on === "string") {
        // sort the collection
        this.props.collection.sort(on, true);
      }
    },

    getBody: function () {
      return React.DOM.tbody({ key: "tbody" }, this.getModels());
    },

    render: function () {
      var cn = [ "table" ];
      if (this.props.striped) {
        cn.push("table-striped");
      }
      if (this.props.condensed) {
        cn.push("table-condensed");
      }
      return React.DOM.table(_.extend(_.omit(this.props, "columns"), { className: cn.join(" ") }), [
        this.getHeader(),
        this.getBody()
      ]);
    }
  });
});
