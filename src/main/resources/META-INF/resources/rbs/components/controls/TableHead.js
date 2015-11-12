/**
 * Renders a clickable table header that lets you sort the collection
 */
define([ "react", "underscore", "../mixins/Events", "../layout/Icon", "util", "../layout/Tip" ],
  function (React, _, events, icon, util, tip) {
    "use strict";
    var rpt = React.PropTypes;
    var d = React.DOM;

    return util.rf({
      displayName: "Collection Table Header",

      propTypes: {
        columns: rpt.arrayOf(
          rpt.shape({
            label: rpt.string,
            sortOn: rpt.string
          })
        ),
        collection: rpt.object.isRequired
      },

      mixins: [ events ],

      componentDidMount: function () {
        // must re-render the header when the collection is sorted
        this.listenTo(this.props.collection, "sort", this.update);
      },

      componentWillReceiveProps: function (nextProps) {
        if (nextProps.collection !== this.props.collection) {
          this.stopListening(this.props.collection);
          this.listenTo(nextProps.collection);
        }
      },

      // get the last sort applied to the collection
      getLastSort: function () {
        if (this.props.collection.sorts && this.props.collection.sorts.length > 0) {
          return this.props.collection.sorts[ 0 ];
        }
        return null;
      },

      sortCollection: function (on) {
        if (typeof on === "string") {
          // sort the collection
          var ls = this.getLastSort();
          var desc = false;
          if (ls !== null && ls.attribute === on) {
            desc = !ls.desc;
          }
          this.props.collection.addSort(on, desc);
          if (this.props.collection.isServerSide()) {
            this.props.collection.fetch();
          } else {
            this.props.collection.sort();
          }
        }
      },

      render: function () {
        var i = 0;
        var lastSort = this.getLastSort();

        var ths = _.map(this.props.columns, function (oneColumn) {
          var so = oneColumn.sortOn;
          var hasSort = (typeof so !== "undefined" && so !== null);
          var sortIcon = null;
          if (typeof so !== "undefined") {
            if (lastSort !== null && lastSort.attribute === so) {
              sortIcon = lastSort.desc ? "sort-amount-desc" : "sort-amount-asc";
            }
          }
          var cn = [ "no-select" ];
          if (hasSort) {
            cn.push("sortable-column-header");
          }
          var children = [
            oneColumn.label,
            icon({ key: "icon", name: sortIcon })
          ];

          // hold off on this until tips play more nicely with onclick events in the children (right now
          // it prevents sorting when present
          if (oneColumn.tip) {
            //children = tip({
            //  tip: oneColumn.tip
            //}, children);
          }

          return d.th({
            key: i++,
            onClick: _.bind(this.sortCollection, this, so),
            className: cn.join(" ")
          }, children);
        }, this);

        return d.thead(_.omit(this.props, "columns", "collection"),
          d.tr({}, ths));
      }

    });
  });
