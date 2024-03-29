/**
 * React Component that renders a question sign and a tooltip when hovered over
 */
define([ "react", "react-dom", "jquery", "underscore", "../mixins/OnClickOutside", "util" ], function (React, dom, $, _, occ, util) {
  "use strict";

  var TOP = "top";
  var LEFT = "left";
  var RIGHT = "right";
  var BOTTOM = "bottom";
  var placements = [ TOP, LEFT, RIGHT, BOTTOM ];

  var rpt = React.PropTypes;
  var d = React.DOM;

  return util.rf({
    displayName: "Tip",

    mixins: [ occ, React.addons.PureRenderMixin ],

    propTypes: {
      tip: rpt.node.isRequired,
      defaultPlacement: rpt.oneOf(placements),
      auto: rpt.bool,
      ignoreClick: rpt.bool
    },

    getDefaultProps: function () {
      return {
        defaultPlacement: "top",
        auto: true,
        ignoreClick: false
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
      $(dom.findDOMNode(this.refs.tip)).scrollParent().on("scroll", this._setPlacement);
    },

    componentWillUnmount: function () {
      $(window).off("resize", this._setPlacement);
      $(dom.findDOMNode(this.refs.tip)).scrollParent().off("scroll", this._setPlacement);
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
      var jqTip = $(dom.findDOMNode(this.refs.tip));
      // where the tip is anchored to
      var jqAnchor = $(dom.findDOMNode(this.refs.container));
      var ht = jqTip.outerHeight() + 8;
      var wd = jqTip.outerWidth() + 8;
      // we will fill this with placements that fit the whole tip, then choose the best one
      var validPlacements = [];
      // the center position of the anchor relative to the viewport
      var p = jqTip.scrollParent();
      var pOff = p.offset() || { top: 0, left: 0 };
      var x = (jqAnchor.offset().left - pOff.left) + (jqAnchor.outerWidth() / 2) - p.scrollLeft();
      var y = (jqAnchor.offset().top - pOff.top) + (jqAnchor.outerHeight() / 2) - p.scrollTop();
      // window width and height
      var wWd = p.width();
      var wHt = p.height();
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
      if (this.props.ignoreClick) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      this.setTipState(!this.state.open);
    },

    render: function () {
      var className = [ "tip-container", ("tip-" + this.state.placement) ];

      if (this.state.open) {
        className.push("tip-container-open");
      }

      return d.span({
        className: className.join(" ")
      }, [
        d.span(_.extend(_.omit(this.props, "placement"), {
          key: "content",
          ref: "container",
          onMouseEnter: _.bind(this.setTipState, this, true),
          onMouseLeave: _.bind(this.setTipState, this, false),
          onClick: _.bind(this.handleClick, this)
        }), this.props.children),
        d.span({
          className: "tip no-select",
          key: "tip",
          ref: "tip",
          onClick: _.bind(this.setTipState, this, false)
        }, this.props.tip)
      ]);
    }

  });
});
