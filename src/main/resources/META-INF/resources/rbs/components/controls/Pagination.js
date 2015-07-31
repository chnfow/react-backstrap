define([ "react", "underscore", "../mixins/Events", "../layout/Icon" ],
  function (React, _, events, icon) {
    "use strict";

    return _.rf({
      displayName: "Pagination",

      mixins: [ events ],

      propTypes: {
        collection: React.PropTypes.object.isRequired,
        nextPage: React.PropTypes.node,
        previousPage: React.PropTypes.node,
        size: React.PropTypes.oneOf([ "sm", "lg" ])
      },

      componentDidMount: function () {
        this.listenTo(this.props.collection, "update reset sync", this.update);
      },

      getDefaultProps: function () {
        return {
          previousPage: icon({ name: "chevron-left" }),
          nextPage: icon({ name: "chevron-right" }),
          size: "sm"
        };
      },

      handlePageClick: function (page) {
        if (page === "N") {
          this.props.collection.nextPage().fetch();
        }
        if (page === "P") {
          this.props.collection.prevPage().fetch();
        }
        if (!isNaN(parseInt(page))) {
          this.props.collection.setPageNo(parseInt(page)).fetch();
        }
      },

      getPage: function (pageObject) {
        var classes = [ "page-button" ];
        if (pageObject.active) {
          classes.push("active");
        }
        if (pageObject.disabled) {
          classes.push("disabled");
        }
        return React.DOM.li({
          key: "page-" + pageObject.page,
          className: classes.join(" "),
          onClick: _.bind(this.handlePageClick, this, pageObject.page)
        }, React.DOM.a({
          href: "#"
        }, pageObject.text));
      },

      getNumPages: function () {
        var numRecords = this.props.collection.size();
        var pageSize = this.props.collection.getPageSize();
        return Math.max(Math.ceil(numRecords / pageSize), 1);
      },

      render: function () {
        var pageButtons = [];

        var numPages = this.getNumPages();
        var curPage = this.props.collection.getPageNo();
        pageButtons.push(
          this.getPage({
            page: "P",
            text: this.props.previousPage,
            disabled: curPage === 0
          })
        );
        for (var i = 0; i < numPages; i++) {
          var active = (i === curPage);
          pageButtons.push(this.getPage({
            page: i,
            text: i + 1,
            active: active
          }));
        }
        pageButtons.push(
          this.getPage({
            page: "N",
            text: this.props.nextPage,
            disabled: curPage === (numPages - 1)
          })
        );

        return React.DOM.nav(_.extend({}, this.props, {
          className: this.props.className
        }), React.DOM.ul({
          className: "pagination pagination-" + this.props.size
        }, pageButtons));
      }
    });

  });
