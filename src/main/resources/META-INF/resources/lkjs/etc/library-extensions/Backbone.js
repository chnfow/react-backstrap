define(["original-backbone", "jsog", "jquery", "underscore-extras", "deep-model"], function (Backbone, JSOG, $, _) {
    "use strict";

    Backbone.Model = Backbone.DeepModel.extend({
        parse: function (response, options) {
            return response ? JSOG.parse(JSOG.stringify(response)) : response;
        }
    });

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
                this.totalRecords =  Math.max(response.length, parseInt(responseHeaderCount));
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


    Backbone.View = (function (oldView) {
        return oldView.extend({
            // extend this instance with the options parameters passed in
            constructor: function (options) {
                if (options) {
                    _.extend(this, _.pick(options, this.options));
                }
                oldView.apply(this, arguments);
            },

            addClass: function (classes) {
                if (typeof this.className === "function") {
                    this.className = _.partial(function (oldClassName) {
                        return oldClassName.call(this) + " " + classes;
                    }, this.className);
                } else if (typeof this.className === "string") {
                    this.className += " " + classes;
                } else {
                    this.className = classes;
                }
            },

            applyAttributes: function () {
                var attr = _.result(this, "attributes");
                var cn = _.result(this, "className");
                if (attr && typeof attr === "object") {
                    this.$el.attr(attr);
                }
                if (typeof cn === "string") {
                    this.$el.attr("class", cn);
                }
            }
        });
    })(Backbone.View);

    return Backbone;
});