/**
 * jQuery extensions
 */
define(["jquery"], function ($) {
  "use strict";
  /**
   * This function extracts data from a form
   * input names can be separated by periods to indicate nesting of objects
   * This does not handle arrays gracefully
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
        } else {
          val = jqEl.val();
        }
        if (tagName === "SELECT" && val === "") {
          val = null;
        }

        toReturn[name] = val;
      });
      return toReturn;
    },

    attrRcr: function (attr) {
      return $(this).closest("[" + attr + "]").attr(attr);
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
});