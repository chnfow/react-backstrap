/**
 *
 */
define([ "react", "underscore", "../mixins/Collection", "../model/TableRow", "../layout/Icon" ], function (React, _, collection, tr, icon) {
  "use strict";

  var rpt = React.PropTypes;

  var tbody = _.rf({
    displayName: "Collection Table Body",
    mixins: [ collection ],
    render: function () {
      return React.DOM.tbody(_.omit(this.props, "collection", "modelComponent", "emptyNode"), this.getModels());
    }
  });

  return _.rf({
    displayName: "Collection Table",

    propTypes: {
      // this is required to indicate the headers-optionally if you do not specify a model component, these columns will also
      // be used to build a table row
      columns: rpt.arrayOf(
        rpt.shape({
          label: rpt.string,
          sortOn: rpt.string
        })
      ).isRequired,
      striped: rpt.bool,
      condensed: rpt.bool,
      hover: rpt.bool,
      bordered: rpt.bool,
      responsive: rpt.bool,
      emptyMessage: rpt.string
    },

    getDefaultProps: function () {
      return {
        striped: true,
        condensed: false,
        hover: false,
        bordered: false,
        responsive: true,
        emptyMessage: "No records found."
      };
    },

    getHeader: function () {
      var i = 0;
      var ths = _.map(this.props.columns, function (oneColumn) {
        var so = oneColumn.sortOn;
        var sortIcon = null;
        var onClick = _.noop;
        if (typeof so !== "undefined") {
          onClick = _.bind(this.sortCollection, this, so);
          sortIcon = icon({ key: "i", name: "sort-amount-asc" });
        }
        return React.DOM.th({
          key: i++,
          onClick: onClick
        }, [ oneColumn.label, sortIcon ]);
      }, this);

      return React.DOM.thead({ key: "thead" }, ths);
    },

    sortCollection: function (on) {
      if (typeof on === "string") {
        // sort the collection
        this.props.collection.addSort(on, true);
        this.props.collection.sort();
      }
    },

    getBody: function () {
      var mc = this.props.modelComponent;

      if (typeof mc !== "function") {
        var attrs = this.props.columns;
        mc = _.rf({
          render: function () {
            return tr({ model: this.props.model, attributes: attrs })
          }
        });
      }

      return tbody({
        key: "tbody",
        collection: this.props.collection,
        modelComponent: mc,
        emptyNode: React.DOM.tr({}, React.DOM.td({ colSpan: this.props.columns.length }, this.props.emptyMessage))
      });
    },

    getTable: function () {
      var cn = [ "table" ];
      if (this.props.striped) {
        cn.push("table-striped");
      }
      if (this.props.condensed) {
        cn.push("table-condensed");
      }
      if (this.props.hover) {
        cn.push("table-hover");
      }

      return React.DOM.table(_.extend(_.omit(this.props, "columns"), { className: cn.join(" ") }), [
        this.getHeader(),
        this.getBody()
      ]);
    },

    render: function () {
      var table = this.getTable();
      if (this.props.responsive) {
        return React.DOM.div({ className: "table-responsive" }, table);
      }
      return table;
    }
  });
});
