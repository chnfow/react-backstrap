/**
 * This view represents the application. Its model represents application state.
 */
define(["backbone", "jquery", "underscore-extras", "ga", "jquery-extensions", "raf"],
  function (Backbone, $, _, ga) {
    "use strict";
    return Backbone.View.extend({
      options: ["root", "viewTypes", "routes", "router", "routeNotFound", "showLoadingBar", "trackingId"],
      viewTypes: ["header", "content", "footer"],
      root: "/",
      showLoadingBar: true,
      loadingElementId: "loading-progress",
      // google analytics tracking id
      trackingId: null,

      initialize: function () {
        this.model = this.model || new Backbone.Model();

        // create the containers for the different view types, so that they are available
        // for the setView function
        this.render();

        // create shortcuts to set the different view types
        _.each(this.viewTypes, function (oneViewType) {
          this["set" + _.capitalize(oneViewType) + "View"] = _.partial(this.setView, oneViewType);
        }, this);

        this.configureRouter();

        if (this.showLoadingBar) {
          $(document).ajaxStart(_.bind(this.showLoader, this)).ajaxStop(_.bind(this.hideLoader, this));
        }

        Backbone.history.start({pushState: true, root: this.root});

        if (ga && this.trackingId) {
          ga('create', this.trackingId, 'auto');
        }
      },

      showLoader: function () {
        var jqEl = this.$("#" + this.loadingElementId);
        if (!jqEl.length) {
          jqEl = $("<div></div>").attr("id", this.loadingElementId).appendTo(this.$el);
        }

        window.requestAnimationFrame(function () {
          // reset the classes on the loading bar
          jqEl.removeClass("done loading");
          // add the loading class and start the timer
          window.requestAnimationFrame(function () {
            jqEl.addClass("loading");
          });
        });
      },

      hideLoader: function () {
        var loadingEl = $("#" + this.loadingElementId);

        window.requestAnimationFrame(function () {
          loadingEl.addClass("done");
        });
      },

      events: {
        "click :internal": "navigateViaRouter"
      },

      render: function () {
        this.$el.empty();
        _.each(this.viewTypes, function (oneViewType) {
          var div = $("<div></div>").attr("id", oneViewType);
          if (_.canRender(this[oneViewType])) {
            div.append(this[oneViewType].render().el);
          }
          this.$el.append(div);
        }, this);
        return this;
      },

      setView: function (viewType, view) {
        if (!_.contains(this.viewTypes, viewType)) {
          console.error("This application does not support this view type", viewType);
          return;
        }
        var oldView = this[viewType];
        if (view !== oldView) {
          if (_.canRemove(oldView)) {
            oldView.remove();
          }
          this[viewType] = view;
          if (_.canRender(this[viewType])) {
            this.$el.find("#" + viewType).html(this[viewType].render().el);
          } else {
            this.$el.find("#" + viewType).empty();
          }
        }
        this.pageView();
        return this;
      },

      lastPage: null,
      pageView: function () {
        if (!ga) {
          return;
        }
        var currentPage = window.location.pathname;
        if (currentPage !== this.lastPage) {
          ga("send", "pageview", currentPage);
        }
        this.lastPage = currentPage;
      },

      navigateViaRouter: function (e) {
        if (e.metaKey || e.ctrlKey || $(e.target).closest(".ignore-link").length > 0) {
          return;
        }
        e.preventDefault();
        var location = $(e.target).closest("[href]").attr("href");
        if (typeof location !== "string" || location === "#") {
          return;
        }
        var pcs = location.split(window.location.origin);
        var url = pcs.length > 1 ? pcs[1] : pcs[0];
        this.goTo(url);
      },

      configureRouter: function () {
        if (this.router) {
          return;
        }
        this.router = new Backbone.Router();
        // catch-all route
        this.router.route("*path", "routeNotFound", _.bind(this.routeNotFound, this));
        // define all the routes
        if (this.routes) {
          this.routes.each(function (oneRoute) {
            this.router.route(oneRoute.get("path"), oneRoute.get("name"), _.bind(oneRoute.get("callback"), this));
          }, this);
        }
      },

      routeNotFound: function (path) {
        console.error("Route not defined for path", path);
      },

      goTo: function (fragment) {
        this.router.navigate(fragment, {trigger: true});
      }
    });
  });