define([ "original-backbone", "jsog", "jquery", "underscore", "moment" ],
  function (Backbone, JSOG, $, _, moment) {
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
            var topLevelValue = _.clone(this.get(firstPc));

            if (pcs.length > 0) {
              var toSet = topLevelValue;
              if (typeof toSet !== "object") {
                toSet = {};
              }
              var ptr = toSet;
              var lastPtr = ptr;
              var lastSetPc = firstPc;
              while (pcs.length > 1) {
                var nextPc = pcs.shift();
                if (typeof toSet[ nextPc ] !== "object") {
                  toSet[ nextPc ] = {};
                }
                lastPtr = ptr;
                lastSetPc = nextPc;
                ptr = toSet[ nextPc ];
              }
              var lastPc = pcs.shift();
              // if the last piece is a string, and the value we're setting is an array
              // then assume we're setting a collection nested models
              var setArrayOfObjects = false;
              if (isNaN(+lastPc) && _.isArray(value)) {
                setArrayOfObjects = true;
                // transform the value to an array of objects
                value = _.map(value, function (oneVal) {
                  var toReturn = {};
                  toReturn[ lastPc ] = oneVal;
                  return toReturn;
                });
              }

              var oldVal = this.get(attribute);
              if (_.isEqual(oldVal, value)) {
                return;
              }
              triggerChange = true;

              if (setArrayOfObjects) {
                // this means we are setting an array in the top leve
                if (lastPtr === toSet) {
                  toSet = value;
                } else {
                  // otherwise, set the previous piece in the ptr chain to the value
                  lastPtr[ lastSetPc ] = value;
                }
              } else {
                ptr[ lastPc ] = value;
              }

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
        server: false,

        // options that can be passed to the constructor
        options: [ "params", "server" ],

        constructor: function (options) {
          if (options) {
            _.extend(this, _.pick(options, this.options));
          }

          oldCollection.apply(this, arguments);
        },

        isServerSide: function () {
          return this.server;
        },

        resetParams: function () {
          this.params = {};
          return this;
        },

        unsetParam: function (key) {
          if (typeof key === "string") {
            this.params = _.omit(this.params, key);
            return this;
          }
        },

        setParam: function (key, value) {
          if (typeof key === "object") {
            this.params = _.extend({}, this.params, key);
          } else if (typeof key === "string") {
            var setObj = {};
            setObj[ key ] = value;
            this.params = _.extend({}, this.params, setObj);
          }
          return this;
        },

        //sort: function () {
        //  return oldCollection.prototype.sort.apply(this, arguments);
        //},

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
          if (!isNaN(responseHeaderCount) && responseHeaderCount > response.length) {
            this.server = true;
            this._totalRecords = Math.max(response.length, responseHeaderCount);
          } else {
            this.server = false;
            this._totalRecords = response.length;
          }
          if (_.isArray(response)) {
            var i = 0;
            _.each(response, function (onePiece) {
              if (_.isObject(onePiece)) {
                onePiece._serverSortOrder = i++;
              }
            });
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
            // if the collection is server side, don't do any sorting
            return (m1.get("_serverSortOrder") < m2.get("_serverSortOrder")) ? -1 : 1;
          }
          if (this.sorts.length > 0) {
            for (var i = 0; i < this.sorts.length; i++) {
              var st = this.sorts[ i ];
              var attr = st.attribute;
              var desc = (st.desc) ? -1 : 1;
              if (typeof attr !== "string") {
                continue;
              }
              // the actual comparison code starts here
              var m1a = m1.get(attr);
              var m2a = m2.get(attr);

              var comparison = this.compareAttributes(m1a, m2a);
              if (comparison !== 0) {
                return comparison * desc;
              }
            }
          }
          // equal at all attributes
          return 0;
        },

        // generic comparator function that handles comparing for sorting different types of values
        compareAttributes: function (attrA, attrB) {
          // check if one or the other is not defined or null
          if ((attrA === null || typeof attrA === "undefined") && (typeof attrB !== "undefined" && attrB !== null)) {
            return 1;
          }
          if ((attrB === null || typeof attrB === "undefined") && (typeof attrA !== "undefined" && attrA !== null)) {
            return -1;
          }

          if (typeof attrA === "string" && typeof attrB === "string") {
            attrA = attrA.toUpperCase();
            attrB = attrB.toUpperCase();
          }

          // if they are both numeric values, use the numeric value to compare the two
          var numA = +attrA, numB = +attrB;
          if (!isNaN(attrA) && !isNaN(attrB) && !isNaN(numA) && !isNaN(numB)) {
            attrA = numA;
            attrB = numB;
          }

          // if they are both strings that look like dates
          if (typeof attrA === "string" && typeof attrB === "string") {
            var tsA = moment.utc(attrA, moment.ISO_8601).unix(), tsB = moment.utc(attrB, moment.ISO_8601).unix();
            if (!isNaN(tsA) && !isNaN(tsB)) {
              attrA = tsA;
              attrB = tsB;
            }
          }

          if (attrA < attrB) {
            return -1;
          }
          if (attrB < attrA) {
            return 1;
          }
          return 0;
        },

        addSort: function (attribute, desc) {
          if (typeof attribute !== "string") {
            return this;
          }
          this.sorts = [
            {
              attribute: attribute,
              desc: Boolean(desc)
            }
          ].concat(this.sorts);
          return this;
        },

        getSortParams: function () {
          var toReturn = {};
          toReturn[ this.sortParam ] = _.map(this.sorts, function (oneSort) {
            return (Boolean(oneSort.desc) ? "D" : "A") + "|" + oneSort.attribute;
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
