/**
 * Renders a row of model attributes
 */
define(["./FormView"], function (formView) {
  "use strict";

  return formView.extend({

    tagName: "div",
    className: "row",

    options: _.union(formView.prototype.options, ["size"]),
    size: "sm",

    render: function () {
      this.$el.empty();
      this.applyAttributes();

      _.each(this.attributeViews, function (oneAttributeView) {
        var colClass = ["col", this.size, oneAttributeView.sourceObject.columns].join("-");
        var div = $("<div></div>").addClass("form-group").addClass(colClass);
        var randomIdentifier = "input-" + _.randomString();

        if (oneAttributeView.sourceObject.label) {
          var label = $("<label></label>")
            .addClass("control-label")
            .text(oneAttributeView.sourceObject.label)
            .attr("for", randomIdentifier);
          div.append(label);
        }

        div.append(oneAttributeView.render().$el);
        oneAttributeView.$el.attr("id", randomIdentifier);
        this.$el.append(div);
      }, this);

      return this;
    }

  });

});