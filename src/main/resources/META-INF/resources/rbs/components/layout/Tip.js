/**
 * React Component that renders a question sign and a tooltip when hovered over
 */
define([ "react", "jquery", "underscore", "../mixins/OnClickOutside" ], function (React, $, _, occ) {
  "use strict";

  var TOP = "top";
  var LEFT = "left";
  var RIGHT = "right";
  var BOTTOM = "bottom";
  var placements = [ TOP, LEFT, RIGHT, BOTTOM ];
  return _.rf({
    displayName: "Tip",

    mixins: [ occ ],

    propTypes: {
      tip: React.PropTypes.node.isRequired,
      defaultPlacement: React.PropTypes.oneOf(placements),
      auto: React.PropTypes.bool
    },

    getDefaultProps: function () {
      return {
        defaultPlacement: "top",
        auto: true
      };
    },

    getInitialState: function () {
      return {
        open: false
      };
    },

    componentDidMount: function () {
      this.setPlacement();

      this._setPlacement = _.debounce(_.bind(this.setPlacement, this), 50);
      $(window).on("resize", this._setPlacement);
      $(React.findDOMNode(this.refs.tip)).scrollParent().on("scroll", this._setPlacement);
    },

    componentWillUnmount: function () {
      $(window).off("resize", this._setPlacement);
      $(React.findDOMNode(this.refs.tip)).scrollParent().off("scroll", this._setPlacement);
    },

    setPlacement: function () {
      if (this.isMounted()) {
        this.setState({
          placement: this.getPlacement()
        });
      }
    },

    getPlacement: function () {
      if (!this.props.auto || !this.isMounted()) {
        return this.props.defaultPlacement;
      }
      // where the actual tip popup is located
      var jqTip = $(React.findDOMNode(this.refs.tip));
      // where the tip is anchored to
      var jqAnchor = $(React.findDOMNode(this.refs.container));
      var ht = jqTip.outerHeight() + 8;
      var wd = jqTip.outerWidth() + 8;
      // we will fill this with placements that fit the whole tip, then choose the best one
      var validPlacements = [];
      // the center position of the anchor relative to the viewport
      var p = jqTip.scrollParent();
      var x = (jqAnchor.offset().left - p.offset().left) + (jqAnchor.outerWidth() / 2) - p.scrollLeft();
      var y = (jqAnchor.offset().top - p.offset().top) + (jqAnchor.outerHeight() / 2) - p.scrollTop();
      // window width and height
      var wWd = p.width();
      var wHt = p.height();
      var placement;
      // first check top is valid
      if ((x + (wd / 2) < wWd) && (x - (wd / 2) > 0) && (y - ht > 0)) {
        validPlacements.push(TOP);
      }
      if ((x + wd < wWd) && (y - (ht / 2) > 0) && (y + (ht / 2) < wHt)) {
        validPlacements.push(RIGHT);
      }
      if ((x + (wd / 2) < wWd) && (x - (wd / 2) > 0) && (y + ht < wHt)) {
        validPlacements.push(BOTTOM);
      }
      if ((x - wd > 0) && (y - (ht / 2) > 0) && (y + (ht / 2) < wHt)) {
        validPlacements.push(LEFT);
      }
      if (validPlacements.length === 0) {
        return this.props.defaultPlacement;
      }
      if (validPlacements.length === 1) {
        return validPlacements[ 0 ];
      }
      if (validPlacements.indexOf(this.props.defaultPlacement) !== -1) {
        return this.props.defaultPlacement;
      }
      return validPlacements[ 0 ];
    },

    setTipState: function (state) {
      if (this.isMounted()) {
        this.setState({
          open: state
        });
      }
    },

    onClickOutside: function () {
      this.setTipState(false);
    },

    handleClick: function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.setTipState(!this.state.open);
    },

    render: function () {
      var className = [ "tip-container", ("tip-" + this.state.placement) ];

      if (this.state.open) {
        className.push("tip-container-open");
      }

      return React.DOM.span({
        className: className.join(" ")
      }, [
        React.DOM.span(_.extend(_.omit(this.props, "placement"), {
          key: "content",
          ref: "container",
          onMouseEnter: _.bind(this.setTipState, this, true),
          onMouseLeave: _.bind(this.setTipState, this, false),
          onClick: _.bind(this.handleClick, this)
        }), this.props.children),
        React.DOM.span({
          className: "tip no-select",
          key: "tip",
          ref: "tip",
          onClick: _.bind(this.setTipState, this, false)
        }, this.props.tip)
      ]);
    }

  });
});
