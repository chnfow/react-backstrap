define(["react", "underscore", "../mixins/Events"],
  function (React, _, events) {
    "use strict";

    return _.rf({
      displayName: "Pagination",

      mixins: [events],

      propTypes: {
        collection: React.PropTypes.object.isRequired,
        nextPage: React.PropTypes.string,
        previousPage: React.PropTypes.string,
        size: React.PropTypes.string
      },

      componentDidMount: function () {
        this.listenTo(this.props.collection, "add remove reset sync", this.update);
      },

      getDefaultProps: function () {
        return {
          previousPage: "&laquo;",
          nextPage: "&raquo;",
          size: "lg",
          className: ""
        };
      },

      handlePageClick: function (page) {
        if (page === "N") {
          this.props.collection.nextPage();
        }
        if (page === "P") {
          this.props.collection.prevPage();
        }
        if (!isNaN(parseInt(page))) {
          this.props.collection.setPageNo(parseInt(page));
        }
      },

      getPage: function (pageObject) {
        var classes = ["page-button"];
        if (pageObject.active) {
          classes.push("active");
        }
        if (pageObject.disabled) {
          classes.push("disabled");
        }
        return React.DOM.li({
          className: classes.join(" "),
          dangerouslySetInnerHTML: {__html: pageObject.text},
          onClick: _.bind(this.handlePageClick, this, pageObject.page)
        });
      },

      getNumPages: function () {
        var numRecords = this.props.collection.size();
        var pageSize = this.props.collection.pageSize;
        return Math.max(Math.ceil(numRecords / pageSize), 1);
      },

      render: function () {
        var pageButtons;

        var numPages = this.getNumPages();
        pageButtons.push(this.getPage({
          page: "P",
          text: this.props.previousPage,
          disabled: this.props.collection.pageNo === 0
        }));
        for (var i = 0; i < numPages; i++) {
          var active = (i === this.props.collection.pageNo);
          pageButtons.push(this.getPage({
            page: i,
            text: i + 1,
            active: active
          }));
        }
        pageButtons.push({
          page: "N",
          text: this.props.nextPage,
          disabled: (this.props.collection.pageNo === (numPages - 1))
        });

        return React.DOM.nav(_.extend({}, this.props, {
          className: this.props.className + " pagination pagination-" + this.props.size
        }), pageButtons);
      }
    });

  });
