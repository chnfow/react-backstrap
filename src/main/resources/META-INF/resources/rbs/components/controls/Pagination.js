define([ "react", "underscore", "../mixins/Events", "../layout/Icon", "util" ],
  function (React, _, events, icon, util) {
    "use strict";

    return util.rf({
      displayName: "Pagination",

      mixins: [ events ],

      propTypes: {
        collection: React.PropTypes.object.isRequired,
        nextPage: React.PropTypes.node,
        previousPage: React.PropTypes.node,
        size: React.PropTypes.oneOf([ "sm", "lg" ]),
        maxPages: React.PropTypes.number
      },

      componentDidMount: function () {
        this.listenTo(this.props.collection, "update reset sync", this.update);
      },

      componentWillReceiveProps: function (nextProps) {
        if (nextProps.collection !== this.props.collection) {
          this.stopListening(this.props.collection);
          this.listenTo(nextProps.collection);
        }
      },

      getDefaultProps: function () {
        return {
          previousPage: icon({ name: "chevron-left" }),
          nextPage: icon({ name: "chevron-right" }),
          size: "sm",
          maxPages: 7
        };
      },

      handlePageClick: function (page) {
        var oldPageNo = this.props.collection.getPageNo();
        if (!isNaN(parseInt(page))) {
          this.props.collection.setPageNo(parseInt(page));
        }
        if (oldPageNo !== this.props.collection.getPageNo()) {
          if (this.props.collection.isServerSide()) {
            this.props.collection.fetch();
          }
          this.update();
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
          key: "page-" + pageObject.key,
          className: classes.join(" "),
          onClick: (pageObject.disabled) ? null : _.bind(this.handlePageClick, this, pageObject.page)
        }, React.DOM.a({
          href: "#"
        }, pageObject.text));
      },

      getNumPages: function () {
        var numRecords = this.props.collection.size();
        var pageSize = this.props.collection.getPageSize();
        return Math.max(Math.ceil(numRecords / pageSize), 1);
      },

      getFirstPage: function () {
        var pages = this.getNumPages();
        if (pages <= this.props.maxPages) {
          return 0;
        }
        var currentPage = this.props.collection.getPageNo();
        var firstPage = Math.ceil(currentPage - (this.props.maxPages / 2));
        var lastPage = Math.floor(currentPage + (this.props.maxPages / 2));
        if (lastPage > (pages - 1)) {
          firstPage -= (lastPage - (pages - 1));
        }
        if (firstPage < 0) {
          firstPage = 0;
        }
        return firstPage;
      },

      render: function () {
        var pageButtons = [];

        var numPages = this.getNumPages();
        var curPage = this.props.collection.getPageNo();
        pageButtons.push(
          this.getPage({
            key: "first",
            page: 0,
            text: "First",
            disabled: curPage === 0
          })
        );
        pageButtons.push(
          this.getPage({
            key: "prev",
            page: curPage - 1,
            text: this.props.previousPage,
            disabled: curPage === 0
          })
        );
        var fp = this.getFirstPage();
        for (var i = fp; i < (fp + Math.min(this.props.maxPages, numPages)); i++) {
          var active = (i === curPage);
          pageButtons.push(this.getPage({
            key: i,
            page: i,
            text: i + 1,
            active: active
          }));
        }
        pageButtons.push(
          this.getPage({
            key: "next",
            page: curPage + 1,
            text: this.props.nextPage,
            disabled: curPage === (numPages - 1)
          })
        );
        pageButtons.push(
          this.getPage({
            key: "last",
            page: numPages - 1,
            text: "Last",
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
