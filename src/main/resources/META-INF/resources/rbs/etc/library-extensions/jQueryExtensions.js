/**
 * jQuery extensions
 */
define(["original-jquery", "moment"], function ($, moment) {
  "use strict";
  /**
   * This function extracts data from a jquery element's inputs, including the selected input, and does some processing to certain types of data
   */
  $.fn.extend({
    formData: function () {
      var toReturn = {};
      $(this).find('[name]:not([name=""])').add(this).each(function (ix, el) {
        var jqEl = $(el),
          type = jqEl.attr("type"),
          name = jqEl.attr("name"),
          tagName = jqEl.prop("tagName"),
          val;

        if (!name) {
          return;
        }

        if (type === "checkbox") {
          val = el.checked;
        } else if (type === "radio") {
          if (!el.checked) {
            return;
          }
          val = jqEl.val();
        } else if (type === "date") {
          val = jqEl.val();
          var mval = moment.utc(val, ["YYYY-MM-DD", "MM/DD/YYYY", "MM/DD/YY"]);
          if (mval.isValid()) {
            val = mval.format("YYYY-MM-DD");
          } else {
            val = null;
          }
        } else {
          val = jqEl.val();
        }
        if (tagName === "SELECT" && val === "") {
          val = null;
        }

        toReturn[name] = val;
      });
      return toReturn;
    }
  });


  /**
   * Internal link selector
   */
  $.expr[':'].internal = function (el) {
    var jqEl = $(el);
    var href = jqEl.attr("href");
    if (typeof href !== "string") {
      return false;
    }
    if (href.indexOf(window.location.origin) === 0) {
      return true;
    }
    if (href.indexOf("//") >= 0) {
      return false;
    }
    return true;
  };


  /**
   * Focusable/tabbable selector from jQuery-UI
   */
  function focusable(element, isTabIndexNotNaN) {
    var map, mapName, img,
      nodeName = element.nodeName.toLowerCase();
    if ("area" === nodeName) {
      map = element.parentNode;
      mapName = map.name;
      if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
        return false;
      }
      img = $("img[usemap='#" + mapName + "']")[0];
      return !!img && visible(img);
    }
    return ( /^(input|select|textarea|button|object)$/.test(nodeName) ?
        !element.disabled :
        "a" === nodeName ?
        element.href || isTabIndexNotNaN :
          isTabIndexNotNaN) &&
        // the element and all of its ancestors must be visible
      visible(element);
  }

  function visible(element) {
    return $.expr.filters.visible(element) && !$(element).parents().addBack().filter(function () {
        return $.css(this, "visibility") === "hidden";
      }).length;
  }

  $.extend($.expr[":"], {
    data: $.expr.createPseudo ?
      $.expr.createPseudo(function (dataName) {
        return function (elem) {
          return !!$.data(elem, dataName);
        };
      }) :
      // support: jQuery <1.8
      function (elem, i, match) {
        return !!$.data(elem, match[3]);
      },

    focusable: function (element) {
      return focusable(element, !isNaN($.attr(element, "tabindex")));
    },

    tabbable: function (element) {
      var tabIndex = $.attr(element, "tabindex"),
        isTabIndexNaN = isNaN(tabIndex);
      return ( isTabIndexNaN || tabIndex >= 0 ) && focusable(element, !isTabIndexNaN);
    }
  });


  return $;
});