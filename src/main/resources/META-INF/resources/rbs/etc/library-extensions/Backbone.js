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

      // internal state variables
      _pageNo: 0,
      _pageSize: 20,
      _totalRecords: null,

      // query parameter names
      startParam: "start",
      countParam: "count",
      sortParam: "sort",

      // header expected in the response for the total number of records for a server collection
      totalRecordsHeader: "X-Total-Count",

      // the applied sorts
      // each sort is represented as { attribute: string, desc: boolean }
      sorts: [],
      // the additional query parameters to use for fetching
      params: {},
      // whether the server is used for sorting and pagination
      server: true,

      // options that can be passed to the constructor
      options: [ "pageNo", "pageSize", "params", "sorts" ],

      constructor: function (options) {
        if (options) {
          _.extend(this, _.pick(options, this.options));
        }

        oldCollection.apply(this, arguments);
      },


      size: function () {
        if (this.server) {
          return (this._totalRecords !== null) ? this._totalRecords : this.models.length;
        }

        return oldCollection.prototype.size.apply(this, arguments);
      },

      getPageNo: function () {
        return this._pageNo;
      },

      setPageNo: function (pageNo) {
        this._pageNo = pageNo;
        this.validatePageNo();
        return this;
      },

      prevPage: function () {
        return this.setPageNo(this._pageNo - 1);
      },

      nextPage: function () {
        return this.setPageNo(this._pageNo + 1);
      },

      setPageSize: function (ps) {
        this._pageSize = ps;
        return this;
      },

      getPageSize: function () {
        return this._pageSize;
      },

      validatePageNo: function () {
        // must be a number
        if (!_.isNumber(this._pageNo) || isNaN(this._pageNo)) {
          this._pageNo = 0;
          return;
        }
        // must be an integer
        this._pageNo = Math.round(this._pageNo);
        if (this.server) {
          if (this._totalRecords !== null) {
            this._pageNo = Math.min(Math.ceil(this._totalRecords / this._pageSize) - 1, this._pageNo);
          }
        }
        this._pageNo = Math.max(0, this._pageNo);
        return this;
      },

      parse: function (response, options) {
        var responseHeaderCount = (options && options.xhr && options.xhr.getResponseHeader ) ?
          parseInt(options.xhr.getResponseHeader(this.totalRecordsHeader)) : 0;
        if (!isNaN(responseHeaderCount)) {
          this._totalRecords = Math.max(response.length, responseHeaderCount);
        } else {
          this._totalRecords = response.length;
        }
        // use the JSOG library to decode whatever the response is
        return _.isObject(response) ? JSOG.decode(response) : response;
      },

      fetch: function (options) {
        options = options || {};

        var dataOptions = {};
        if (options.data) {
          dataOptions = _.parseQueryString(options.data);
        }
        var params = _.extend(this.getPaginationParams(), this.getSortParams(), _.result(this, "params"), dataOptions);

        options.data = $.param(params, true);
        return oldCollection.prototype.fetch.call(this, options);
      },

      resetSorts: function () {
        this.sorts = [];
        return this;
      },

      comparator: function (m1, m2) {
        if (this.server) {
          return 0;
        }
        // TO-DO implement this method for client sorting
        return 0;
      },

      addSort: function (attribute, desc) {
        if (typeof attribute !== "string") {
          return this;
        }
        this.sorts.push({
          attribute: attribute,
          desc: Boolean(desc)
        });
        return this;
      },

      getSortParams: function () {
        var toReturn = {};
        toReturn[ this.sortParam ] = _.map(this.sorts, function (oneSort) {
          return oneSort.attribute + "|" + (Boolean(oneSort.desc)).toString();
        });
        return toReturn;
      },

      getPaginationParams: function () {
        var toReturn = {};
        toReturn[ this.startParam ] = this._pageNo * this._pageSize;
        toReturn[ this.countParam ] = this._pageSize;
        return toReturn;
      }

    });

  })(Backbone.Collection);

  // don't use Backbone views
  delete Backbone.View;

  return Backbone;
});
