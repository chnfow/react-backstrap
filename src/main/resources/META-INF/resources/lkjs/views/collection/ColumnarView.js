define(["./CollectionView", "underscore"], function (colView, _) {
  "use strict";
  return colView.extend({
    options: _.union(colView.prototype.options, ["minColumns", "size"]),
    minColumns: 4,
    size: "md",

    render: function () {
      this.$el.empty();
      this.applyAttributes();

      var colsPerModel = Math.floor(Math.max(this.minColumns, 12 / Math.max(this.collection.size(), 1)));
      var modelsPerRow = 12 / colsPerModel;
      var colClass = ["col", this.size, colsPerModel].join("-");
      var modelNo = 0;

      var row;
      this.collection.each(function (oneModel) {
        if (_.canRender(this.views[oneModel.cid])) {
          if (modelNo % modelsPerRow === 0) {
            row = $("<div></div>").addClass("row");
            this.$el.append(row);
          }
          modelNo++;
          var col = $("<div></div>").addClass(colClass).append(this.views[oneModel.cid].render().$el);
          row.append(col);
        }
      }, this);

      if (this.collection.size() === 0 && this.emptyEl) {
        this.$el.append(this.emptyEl);
      }
      return this;
    }

  });
});
