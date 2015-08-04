/**
 *
 */
define([ "react", "underscore", "../mixins/Collection", "../mixins/Events", "../model/TableRow", "../layout/Icon" ],
  function (React, _, collection, events, tr, icon) {
    "use strict";

    var rpt = React.PropTypes;

    var thead = _.rf({
      displayName: "Collection Table Header",

      propTypes: {
        columns: rpt.arrayOf(
          rpt.shape({
            label: rpt.string,
            sortOn: rpt.string
          })
        )
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
        e.preventDefault();
        if (typeof on === "string") {
          // sort the collection
          var ls = this.getLastSort();
          var desc = false;
          if (ls !== null && ls.attribute === on) {
            desc = !ls.desc;
          }
          this.props.collection.addSort(on, desc);
          this.props.collection.sort();
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
          return React.DOM.th({
            key: i++,
            onMouseDown: _.bind(this.sortCollection, this, so),
            className: hasSort ? "sortable-column-header" : ""
          }, [ oneColumn.label, icon({ key: "icon", name: sortIcon }) ]);
        }, this);

        return React.DOM.thead({ key: "thead" }, ths);
      }

    });

    var tbody = _.rf({
      displayName: "Collection Table Body",

      mixins: [ collection ],

      render: function () {
        var cols = this.props.columns;
        var children = _.map(this.getModels(), function (oneComp) {
          return React.cloneElement(oneComp, { columns: cols });
        });

        return React.DOM.tbody(_.omit(this.props, "collection", "modelComponent", "emptyNode"), children);
      }
    });

    // start table view
    return _.rf({
      displayName: "Collection Table",

      propTypes: {
        // bootstrap classes
        striped: rpt.bool,
        condensed: rpt.bool,
        hover: rpt.bool,
        bordered: rpt.bool,
        // what the table should say when empty
        emptyMessage: rpt.string
      },

      getDefaultProps: function () {
        return {
          striped: true,
          condensed: false,
          hover: false,
          bordered: false,
          emptyMessage: "No records found."
        };
      },

      getModelComponent: function (props) {
        var mc = props.modelComponent;

        if (typeof mc !== "function") {
          var attrs = props.columns;
          // just a plain wrapper around the tr that passes the columns for the attrs
          mc = _.rf({
            render: function () {
              return tr({ model: this.props.model, attributes: attrs })
            }
          });
        }

        return mc;
      },

      componentWillReceiveProps: function (nextProps) {
        if (this.isMounted()) {
          this.setState({
            modelComponent: this.getModelComponent(nextProps)
          });
        }
      },

      getInitialState: function () {
        return {
          modelComponent: this.getModelComponent(this.props)
        };
      },

      render: function () {
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

        if (typeof this.props.className === "string") {
          cn.push(this.props.className);
        }

        var properties = _.extend(_.omit(this.props, "columns", "striped", "condensed", "hover", "bordered"), { className: cn.join(" ") });

        return React.DOM.table(properties, [
          thead({ key: "thead", columns: this.props.columns, collection: this.props.collection }),
          tbody({
            key: "tbody",
            collection: this.props.collection,
            modelComponent: this.state.modelComponent,
            emptyNode: React.DOM.tr({ key: "empty-row-name" }, React.DOM.td({ colSpan: this.props.columns.length }, this.props.emptyMessage))
          })
        ]);
      }
    });
  });
