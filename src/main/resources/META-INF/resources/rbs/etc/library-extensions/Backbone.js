define([ "original-backbone", "jsog", "jquery", "original-underscore" ], function (Backbone, JSOG, $, _) {
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
            // an added benefit of this get, is that if the pc we're trying to get is not defined
            // and the parent is an array, then we assume the user meant to get an attribute on the objects of the array
            if (pcs.length === 0 && _.isArray(val) && typeof val[ pc ] === "undefined") {
              return _.pluck(val, pc);
            }
            val = val[ pc ];
          }
        }
        return val;
      },

      set: function (key, val, options) {
        // defer to the Backbone version if we don't get an object or a string for the first argument
        if (typeof key !== "object" && typeof key !== "string") {
          return oldSet.apply(this, arguments);
        }

        // if key is the name of the attribute, convert to the object version of this call
        var attrHash;
        // name of attribute passed as first argument
        if (typeof key === "string") {
          attrHash = {};
          attrHash[ key ] = val;
        } else {
          // set(hash, options) called
          attrHash = key;
          options = val || {};
        }

        var silentOptions = _.extend({}, options, { silent: true });
        var triggerChange = false;

        // for each attribute we're setting
        _.each(attrHash, function (value, attribute) {
          if (typeof attribute !== "string") {
            if (typeof attribute.toString === "function") {
              attribute = attribute.toString();
            } else {
              return;
            }
          }
          var pcs = attribute.split(".");
          var firstPc = pcs.shift();
          var topLevelValue = this.get(firstPc);

          if (pcs.length > 0) {
            var toSet = topLevelValue;
            if (typeof toSet !== "object") {
              toSet = {};
            }
            var ptr = toSet;
            while (pcs.length > 1) {
              var nextPc = pcs.shift();
              if (typeof toSet[ nextPc ] !== "object") {
                toSet[ nextPc ] = {};
              }
              ptr = toSet[ nextPc ];
            }
            var lastPc = pcs.shift();
            var oldVal = ptr[ lastPc ];
            if (_.isEqual(oldVal, value)) {
              return;
            }
            triggerChange = true;
            ptr[ lastPc ] = value;
            oldSet.call(this, firstPc, toSet, silentOptions);
            this.trigger("change:" + attribute, this, value, options);
          } else {
            // setting a top level attribute
            if (_.isEqual(value, topLevelValue)) {
              return;
            }
            triggerChange = true;
            oldSet.call(this, firstPc, value, silentOptions);
            this.trigger("change:" + firstPc, this, value, options);
          }
        }, this);

        if (triggerChange) {
          this.trigger("change", this, options);
        }
        return this;
      },

      parse: function (response, options) {
        return _.isObject(response) ? JSOG.decode(response) : response;
      },

      // failed validation should return a promise
      save: function (attributes, options) {
        var toReturn = oldModel.prototype.save.apply(this, arguments);
        if (toReturn === false) {
          var def = $.Deferred();
          def.reject(this, false, options);
          return def.promise();
        }
        return toReturn;
      }
    });
  })(Backbone.Model);

  Backbone.Collection = (function (oldCollection) {
    return oldCollection.extend({
      model: Backbone.Model,
      pageNo: 0,
      pageParam: "X-First-Result",
      pageSize: 20,
      pageSizeParam: "X-Per-Page",
      totalRecords: null,
      totalRecordsParam: "X-Total-Count",
      sorts: [],
      additionalParams: {},

      options: [ "pageNo", "pageSize", "additionalParams", "sorts" ],

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
        return (!isNaN(parseInt(this.totalRecords))) ?
          parseInt(this.totalRecords) : oldCollection.prototype.size.apply(this, arguments);
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
        return _.isObject(response) ? JSOG.decode(response) : response;
      },

      fetch: function (options) {
        options = options || {};

        if (options.headers) {
          $.extend(options.headers, this.getFetchHeaders());
        } else {
          options.headers = this.getFetchHeaders();
        }
        var paramString = [ $.param(_.result(this, "additionalParams")), this.getSortParams() ].join("&");
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
        this.sorts = [ sort ].concat(this.sorts);
        this.fetch();
      },

      getSortParams: function () {
        return this.sorts.join("&");
      },

      getFetchHeaders: function () {
        var toReturn = {};
        toReturn[ this.pageParam ] = this.pageNo * this.pageSize;
        toReturn[ this.pageSizeParam ] = this.pageSize;
        return toReturn;
      }

    });

  })(Backbone.Collection);

  // don't use Backbone views :)
  delete Backbone.View;

  return Backbone;
});