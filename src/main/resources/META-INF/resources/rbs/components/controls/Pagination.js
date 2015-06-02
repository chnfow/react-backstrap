define(["backbone", "rbs/components/collection/UnorderedListView", "rbs/components/model/ListItemView", "bootstrap"],
  function (Backbone, ulView, liView) {
  "use strict";

  var pageView = liView.extend({
    className: function () {
      var classes = ["page-button"];
      if (this.model.get("active")) {
        classes.push("active");
      }
      if (this.model.get("disabled")) {
        classes.push("disabled");
      }
      return classes.join(" ");
    },

    attributes: function () {
      return { "data-page-no": this.model.get("id") };
    },

    initialize: function () {
      liView.prototype.initialize.apply(this, arguments);
      this.listenTo(this.model, "change:active change:disabled change:pageNo", this.render);
    },

    modelAttributes: [
      {
        tagName: "a",
        attributes: { href: "#" },
        attribute: "text",
        view: "span",
        // don't do escaping
        formatFunction: function (val) {
          return val;
        }
      }
    ]
  });

  return Backbone.View.extend({
    tagName: "nav",

    options: ["nextPage", "previousPage", "size"],

    previousPage: "&laquo;",
    nextPage: "&raquo;",
    size: "lg",

    events: {
      "click .page-button": "setPage"
    },

    initialize: function () {
      if (!this.collection) {
        console.error("Pagination controls require a collection");
      }
      this.pageCollection = new Backbone.Collection();
      this.setPageCollection();
      // whenever the collection changes, make sure the page selector reflect that
      this.listenTo(this.collection, "add remove reset", _.debounce(this.setPageCollection, 20));

      this.controls = new ulView({
        className: "pagination" + ((this.size) ? (" pagination-" + this.size) : ""),
        collection: this.pageCollection,
        modelView: pageView
      });
    },

    getNumPages: function () {
      var numRecords = this.collection.size();
      var pageSize = this.collection.pageSize;
      var numPages = Math.max(Math.ceil(numRecords / pageSize), 1);
      return numPages;
    },

    /**
     * This function takes the collection and determines the page numbers to display
     */
    setPageCollection: function () {
      var pages = [];

      var numPages = this.getNumPages();
      pages.push({
        text: this.previousPage,
        id: "P",
        disabled: this.collection.pageNo === 0
      });
      for (var i = 0; i < numPages; i++) {
        var active = (i === this.collection.pageNo);
        pages.push({
          id: i,
          text: i + 1,
          active: active
        });
      }
      pages.push({
        text: this.nextPage,
        id: "N",
        disabled: (this.collection.pageNo === (numPages - 1))
      });
      this.pageCollection.set(pages);
    },

    setPage: function (e) {
      var page = $(e.target).attrRcr("data-page-no");
      if (page === "N") {
        this.collection.nextPage();
      }
      if (page === "P") {
        this.collection.prevPage();
      }
      if (!isNaN(parseInt(page))) {
        this.collection.setPageNo(parseInt(page));
      }
    },

    render: function () {
      this.$el.empty();
      this.$el.append(this.controls.render().$el);
      return this;
    }
  });
});
