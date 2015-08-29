/**
 * Renders a table, which is a combination of the table header and table body views
 */
define([ "react", "underscore", "../model/TableRow", "../collection/TableBody", "../controls/TableHead" ],
  function (React, _, tr, tbody, thead) {
    "use strict";

    var rpt = React.PropTypes;

    return _.rf({
      displayName: "Collection Table",

      propTypes: {
        // bootstrap classes
        striped: rpt.bool,
        condensed: rpt.bool,
        hover: rpt.bool,
        bordered: rpt.bool,
        // what the table should say when empty
        emptyMessage: rpt.string,
        scroll: rpt.bool,
        responsive: rpt.bool,
        attributes: rpt.arrayOf(
          rpt.shape({
            label: rpt.string,
            sortOn: rpt.string
          })
        )
      },

      getDefaultProps: function () {
        return {
          striped: true,
          condensed: false,
          hover: false,
          bordered: false,
          emptyMessage: "No records found.",
          scroll: false,
          responsive: true
        };
      },

      getModelComponent: function (props) {
        var attrs = props.attributes;

        return _.rf({
          render: function () {
            return tr({ model: this.props.model, attributes: attrs })
          }
        });
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

      getColumns: function () {
        return _.map(this.props.attributes, function (oneAttribute) {
          return {
            label: oneAttribute.label,
            sortOn: oneAttribute.sortOn
          };
        });
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
        if (this.props.responsive) {
          cn.push("table-responsive-horizontal");
        }
        if (typeof this.props.className === "string") {
          cn.push(this.props.className);
        }

        var columns = this.getColumns();

        var properties = _.extend(_.omit(this.props, "attributes", "columns", "striped", "condensed", "hover", "bordered"), { className: cn.join(" ") });
        var table = React.DOM.table(properties, [
          thead({ key: "thead", columns: columns, collection: this.props.collection }),
          tbody({
            key: "tbody",
            collection: this.props.collection,
            modelComponent: this.state.modelComponent,
            emptyNode: React.DOM.tr({ key: "empty-row-name" }, React.DOM.td({ colSpan: columns.length }, this.props.emptyMessage))
          })
        ]);

        if (this.props.scroll) {
          return React.DOM.div({ className: "table-responsive" }, table);
        }
        return table;
      }
    });
  });
