define(["original-backbone", "jsog", "jquery", "underscore-extras"], function (Backbone, JSOG, $, _) {
  "use strict";

  Backbone.Model = (function (oldModel) {
    var oldGet = oldModel.prototype.get;
    var oldSet = oldModel.prototype.set;
    return oldModel.extend({
      // allow getting nested attributes via strings that are separated with a period
      get: function (attribute) {
        var pcs;
        // if attribute isn't a string or is a single piece, just use the old get
        if (typeof attribute !== "string" || (pcs = attribute.split(".")).length === 1) {
          return oldGet.apply(this, arguments);
        }

        var firstPc = pcs.shift();
        var val = oldGet.call(this, firstPc);

        var pc;
        while (pcs.length > 0 && typeof val !== "undefined" && val !== null) {
          pc = pcs.shift();
          if (typeof val.get === "function") {
            val = val.get(pc);
          } else {
            val = val[pc];
          }
        }
        return val;
      },

      set: function (key, val, options) {
        // defer to the Backbone version if we don't get an object or a string for the first argument
        if (typeof key !== "object" && typeof key !== "string") {
          return oldSet.apply(this, arguments);
        }

        // if we do get a hash of attributes to set, just call the key, val version for each key to simplify the remaining code
        if (typeof key === "object") {
          _.each(key, function (value, attribute) {
            this.set(value, attribute, options);
          }, this);
          return this;
        }

        // at this point we know key is a string
        var pcs = key.split(".");
        // if we're not setting a nested attribute, defer to the old version
        if (pcs.length === 1) {
          return oldSet.apply(this, arguments);
        }

        // this is where the special logic starts - if we are setting a nested attribute, we will just use the old set
        // on the first piece of the attribute, but modify the object that we are setting and trigger a change event on
        // the nested attribute

        var firstPc = pcs.shift();
        var toSet = this.get(firstPc);
        var ptr = toSet;
        // modify toSet with the new val
        while (pcs.length > 1) {
          var nextPc = pcs.shift();
          // if it's not set, just put an empty object there
          if (ptr[nextPc] === null || typeof ptr[nextPc] === "undefined") {
            ptr[nextPc] = {};
          }
          // move the ptr down a level
          ptr = ptr[nextPc];
        }

        ptr[pcs.shift()] = val;

        // set toSet back into the parent using oldSet, silently
        oldSet.call(this, firstPc, toSet, _.extend(options, { silent: true }));
        // then trigger the change to the attribute
        this.trigger("change:" + key, this, val, options);
        return this;
      },

      parse: function (response, options) {
        return response ? JSOG.parse(JSOG.stringify(response)) : response;
      }
    });
  })(Backbone.Model);

  Backbone.Collection = (function (oldCollection) {
    return oldCollection.extend({
      model: Backbone.DeepModel,
      pageNo: 0,
      pageParam: "X-First-Result",
      pageSize: 20,
      pageSizeParam: "X-Per-Page",
      totalRecords: null,
      totalRecordsParam: "X-Total-Count",
      sorts: [],
      additionalParams: {},

      options: ["pageNo", "pageSize", "additionalParams", "sorts"],

      constructor: function (options) {
        if (options) {
          _.extend(this, _.pick(options, this.options));
        }
        // allow multiple back-to-back configuration calls and only re-fetching once
        this.fetch = _.debounce(_.bind(this.fetch, this), 25);
        oldCollection.apply(this, arguments);
      },

      save: function (options) {
        return Backbone.sync("update", this, options);
      },

      size: function () {
        return (!isNaN(parseInt(this.totalRecords))) ? parseInt(this.totalRecords) : 0;
      },

      getPageNo: function () {
        return this.pageNo;
      },

      setPageNo: function (pageNo) {
        var oldPageNo = this.pageNo;
        this.pageNo = pageNo;
        this.validatePageNo();
        if (oldPageNo !== this.pageNo) {
          this.fetch();
        }
      },

      prevPage: function () {
        var oldPageNo = this.pageNo;
        this.pageNo--;
        this.validatePageNo();
        if (oldPageNo !== this.pageNo) {
          this.fetch();
        }
      },

      nextPage: function () {
        var oldPageNo = this.pageNo;
        this.pageNo++;
        this.validatePageNo();
        if (oldPageNo !== this.pageNo) {
          this.fetch();
        }
      },

      validatePageNo: function () {
        this.pageNo = Math.round(this.pageNo);
        if (this.totalRecords !== null) {
          this.pageNo = Math.min(Math.ceil(this.totalRecords / this.pageSize) - 1, this.pageNo);
        }
        this.pageNo = Math.max(0, this.pageNo);
      },

      parse: function (response, options) {
        var responseHeaderCount = options && options.xhr && options.xhr.getResponseHeader ? options.xhr.getResponseHeader(this.totalRecordsParam) : 0;
        this.totalRecords = Math.max(response.length, parseInt(responseHeaderCount));
        // convert the JSON into a cyclic object graph
        return JSOG.parse(JSOG.stringify(response));
      },

      fetch: function (options) {
        options = options || {};

        if (options.headers) {
          $.extend(options.headers, this.getFetchHeaders());
        } else {
          options.headers = this.getFetchHeaders();
        }
        var paramString = [$.param(_.result(this, "additionalParams")), this.getSortParams()].join("&");
        if (options.data) {
          options.data = _.removeEmptyValues(options.data + "&" + paramString, "&");
        } else {
          options.data = _.removeEmptyValues(paramString, "&");
        }

        return oldCollection.prototype.fetch.call(this, options);
      },

      resetSort: function () {
        this.sorts = [];
        this.fetch();
      },

      sort: function (attribute, desc) {
        var order = desc ? "D" : "A";
        var sort = "sort=" + order + "|" + attribute;
        this.sorts = [sort].concat(this.sorts);
        this.fetch();
      },

      getSortParams: function () {
        return this.sorts.join("&");
      },

      getFetchHeaders: function () {
        var toReturn = {};
        toReturn[this.pageParam] = this.pageNo * this.pageSize;
        toReturn[this.pageSizeParam] = this.pageSize;
        return toReturn;
      }

    });

  })(Backbone.Collection);

  return Backbone;
});