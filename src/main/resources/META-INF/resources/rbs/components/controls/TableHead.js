/**
 * Renders a clickable table header that lets you sort the collection
 */
define([ "react", "underscore", "../mixins/Events", "../layout/Icon" ],
  function (React, _, events, icon) {
    "use strict";
    var rpt = React.PropTypes;

    return _.rf({
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

      // get the last sort applied to the collection
      getLastSort: function () {
        if (this.props.collection.sorts && this.props.collection.sorts.length > 0) {
          return this.props.collection.sorts[ 0 ];
        }
        return null;
      },

      sortCollection: function (on, e) {
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
          return React.DOM.th({
            key: i++,
            onClick: _.bind(this.sortCollection, this, so),
            className: cn.join(" ")
          }, [ oneColumn.label, icon({ key: "icon", name: sortIcon }) ]);
        }, this);

        return React.DOM.thead(_.omit(this.props, "columns", "collection"), ths);
      }

    });
  });
