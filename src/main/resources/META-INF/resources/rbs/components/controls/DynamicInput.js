// defines an input whose width is always the size of its content
define(["react", "underscore", "jquery"], function (React, _, $) {
  "use strict";

  var widthCalculatorStyle = {
    position: "absolute",
    visibility: "hidden",
    whiteSpace: "nowrap"
  };

  var widthStyles = ["font", "fontStyle", "fontVariant", "fontWeight", "fontSize", "fontFamily", "boxSizing", "padding", "margin", "border"];

  return _.rf({

    displayName: "Dynamic Input",

    propTypes: {
      placeholder: React.PropTypes.string,
      inputWidthRetryDelay: React.PropTypes.number
    },

    getDefaultProps: function () {
      return {};
    },

    getInput: function () {
      return this.refs.input.getDOMNode();
    },

    getInitialState: function () {
      return {
        width: 0,
        inputWidthRetryDelay: 100
      };
    },

    componentDidMount: function () {
      this.copyStylesToCalculators();
      this.updateWidth();
    },

    copyStyle: function (nodeA, nodeB) {
      var styleOfNodeA = this.getStyle(nodeA);
      _.extend(nodeB.style, _.pick(styleOfNodeA, widthStyles));
    },

    getStyle: function (node) {
      if (window.getComputedStyle) {
        return window.getComputedStyle(node);
      }
      return node.currentStyle;
    },

    isVisible: function () {
      return (this.isMounted() && $(React.findDOMNode(this)).is(":visible"));
    },

    componentDidUpdate: function () {
      this.updateWidth();
    },

    copyStylesToCalculators: function () {
      var input = this.refs.input.getDOMNode();
      this.copyStyle(input, this.refs.valueCalculator.getDOMNode());
      if (this.props.placeholder) {
        this.copyStyle(input, this.refs.placeholderCalculator.getDOMNode());
      }
    },

    updateWidth: function () {
      // if we couldn't adjust the input size this time, wait until it's visible
      if (!this.isVisible()) {
        setTimeout(_.bind(this.updateWidth, this), this.props.inputWidthRetryDelay);
        return;
      }
      var newWidth = this.refs.valueCalculator.getDOMNode().offsetWidth + 2;
      if (this.props.placeholder) {
        newWidth = Math.max(newWidth, this.refs.placeholderCalculator.getDOMNode().offsetWidth + 2);
      }
      var container = this.refs.container.getDOMNode();
      if (container.parentNode) {
        var parentStyle = this.getStyle(container.parentNode);
        newWidth = Math.min(newWidth, container.parentNode.clientWidth - (parseFloat(parentStyle.paddingLeft) + parseFloat(parentStyle.paddingRight)));
      }

      if (newWidth !== this.state.width) {
        this.setState({
          width: newWidth
        });
      }
    },

    focus: function () {
      this.refs.input.getDOMNode().focus();
    },

    blur: function () {
      this.refs.input.getDOMNode().blur();
    },

    getCalculator: function (text, ref) {
      return React.DOM.div({
        style: widthCalculatorStyle,
        ref: ref,
        key: ref,
        dangerouslySetInnerHTML: { __html: this.getText(text) }
      });
    },

    getText: function (text) {
      return _.escape(text).replace(/ /g, "&nbsp;");
    },

    render: function render() {
      var children = [];
      children.push(this.getCalculator(this.props.value, "valueCalculator"));
      if (this.props.placeholder) {
        children.push(this.getCalculator(this.props.placeholder, "placeholderCalculator"));
      }

      var inputStyling = this.props.style || {};
      inputStyling.width = this.state.width;

      children.push(
        React.DOM.input(_.extend({}, this.props, {
          ref: "input",
          key: "input",
          style: inputStyling
        }))
      );

      return React.DOM.div({
        ref: "container",
        style: {
          display: "inline-block"
        }
      }, children);
    }

  });

});