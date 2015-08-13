/**
 * React Component that renders a question sign and a tooltip when hovered over
 */
define([ "react", "underscore", "../mixins/OnClickOutside" ], function (React, _, occ) {
  "use strict";

  return _.rf({
    displayName: "Tip",

    mixins: [ occ ],

    propTypes: {
      tip: React.PropTypes.node.isRequired,
      defaultPlacement: React.PropTypes.oneOf([ "top", "right", "left", "bottom" ]),
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
    },

    componentWillUnmount: function () {
      $(window).off("resize", this._setPlacement);
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
      var jqTip = $(React.findDOMNode(this.refs.tip));
      var ht = jqTip.outerHeight() + 8;
      var wd = jqTip.outerWidth() + 8;
      var jqAnchor = $(React.findDOMNode(this.refs.container));
      // the coordinates of the element relative to the window
      var w = $(window);
      var x = jqAnchor.offset().left - w.scrollLeft();
      var y = jqAnchor.offset().top - w.scrollTop();
      var windowHeight = w.height();
      var windowWidth = w.width();
      var placement = this.props.defaultPlacement;
      if (y - ht < 0 && placement === "top") {
        placement = "right";
      }
      if (x + wd > windowWidth && placement === "right") {
        placement = "bottom";
      }
      if (y + ht > windowHeight && placement === "bottom") {
        placement = "left";
      }
      return placement;
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
