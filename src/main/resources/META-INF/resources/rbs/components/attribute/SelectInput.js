define([ "react", "underscore", "../mixins/Attribute", "../controls/DynamicInput" ],
  function (React, _, attribute, dynamicInput) {
    "use strict";

    var KEY_BACKSPACE = 8;
    var KEY_LEFT = 37;
    var KEY_RIGHT = 39;
    var KEY_DELETE = 46;


    // this input just displays all the current model attribute values
    // (or just the one if it's a single value attribute)
    // and allows the user to move the cursor and delete values from the model
    return _.rf({
      displayName: "Fake Select Input",
      mixins: [ attribute, React.addons.PureRenderMixin ],

      propTypes: {
        modelComponent: React.PropTypes.func.isRequired,
        value: React.PropTypes.string.isRequired,
        collection: React.PropTypes.object.isRequired,
        valueAttribute: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        multiple: React.PropTypes.bool,
        onKeyDown: React.PropTypes.func,
        onFocus: React.PropTypes.func,
        onBlur: React.PropTypes.func,
        onRemove: React.PropTypes.func
      },

      getDefaultProps: function () {
        return {
          valueAttribute: "id",
          multiple: false,
          placeholder: "Select..."
        };
      },

      getInitialState: function () {
        return {
          cursorPosition: 0,
          open: false
        };
      },

      componentWillReceiveProps: function (nextProps) {
        if (nextProps.value.length > 0) {
          this.setState({ cursorPosition: 0 });
        }
      },

      componentDidUpdate: function () {
        if (this.state.open) {
          this.refs.search.focus();
        }
      },

      findModelByValue: function (value) {
        if (this.props.valueAttribute === "id") {
          return this.props.collection.get(value);
        }
        var findObj = {};
        findObj[ this.props.valueAttribute ] = value;
        return this.props.collection.findWhere(findObj);
      },

      handleKeyDown: function (e) {
        switch (e.keyCode) {
          case KEY_LEFT:
          case KEY_RIGHT:
          case KEY_BACKSPACE:
          case KEY_DELETE:
            // this is true of all the actions
            if (this.props.value.length > 0) {
              return;
            }
            // switch again
            switch (e.keyCode) {
              // left and right do basically the same thing
              case KEY_LEFT:
              case KEY_RIGHT:
                this.setCursorPosition(this.state.cursorPosition + (e.keyCode === KEY_LEFT ? 1 : -1));
                break;
              // same with backspace/delete
              case KEY_BACKSPACE:
              case KEY_DELETE:
                this.removeSelectedItemAt(this.state.cursorPosition + (e.keyCode === KEY_BACKSPACE ? 1 : 0));
                break;
            }
            break;
          default:
            if (this.props.onKeyDown) {
              this.props.onKeyDown(e);
            }
            break;
        }
      },

      setCursorPosition: function (cp) {
        var val = this.getValue();
        if (!_.isArray(val)) {
          cp = 0;
        } else {
          cp = Math.max(0, Math.min(val.length, cp));
        }
        this.setState({
          cursorPosition: cp
        });
      },

      removeSelectedItemAt: function (countFromLast) {
        if (typeof countFromLast !== "number" || !this.props.multiple) {
          this.props.model.unset(this.props.attribute);
          return;
        }
        var currentValue = this.getValue();
        if (this.props.multiple && !_.isArray(currentValue)) {
          return;
        }
        var realIndex = currentValue.length - countFromLast;
        if (currentValue.length <= realIndex || realIndex < 0) {
          return;
        }
        var newValue = _.clone(currentValue);
        var removing = newValue.splice(realIndex, 1);
        this.props.model.set(this.props.attribute, newValue);
        this.setState({
          cursorPosition: countFromLast - 1
        }, function () {
          if (this.props.onRemove) {
            this.props.onRemove(this.findModelByValue(removing), removing);
          }
        });
      },

      handleFocus: function (e) {
        this.setState({ open: true });
        if (this.props.onFocus) {
          this.props.onFocus(e);
        }
      },

      handleBlur: function (e) {
        this.setState({ open: false });
        if (this.props.onBlur) {
          this.props.onBlur(e);
        }
      },

      handleClick: function (e) {
        e.preventDefault();
        this.refs.search.focus();
      },

      handleChange: function (e) {
        this.setState({
          cursorPosition: 0
        });
        if (this.props.onChange) {
          this.props.onChange(e);
        }
      },


      getDisplayItem: function (className, model) {
        return React.DOM.span({
          className: className,
          key: "result-cid-" + model.cid
        }, this.props.modelComponent({ model: model }));
      },

      render: function () {
        var currentValue = this.getValue();
        // get all the views for the selected items
        var selectedItems = [];
        if (!this.props.multiple) {
          if (this.props.value.length === 0) {
            var model = this.findModelByValue(currentValue);
            if (model) {
              selectedItems = [ this.getDisplayItem("fancy-select-single-choice", model) ];
            }
          }
        } else {
          if (_.isArray(currentValue)) {
            // items not found in the collection are not displayed
            var selectedModels = _.filter(_.map(currentValue, this.findModelByValue, this), Boolean);
            // map them into views
            selectedItems = _.map(selectedModels, _.bind(this.getDisplayItem, this, "fancy-select-multiple-choice"));
          }
        }

        //only display the placeholder if there is no value selected
        var placeholder;
        if (this.props.placeholder && selectedItems.length === 0) {
          placeholder = this.props.placeholder;
        }

        // create the typing area
        var typingArea = dynamicInput(_.extend({}, this.props, {
          // don't take the styling for the input since this is just where the cursor goes
          className: "fancy-select-type-area",
          ref: "search",
          key: "search",
          onKeyDown: this.handleKeyDown,
          onFocus: this.handleFocus,
          onBlur: this.handleBlur,
          onChange: this.handleChange,
          placeholder: placeholder
        }));

        // determine what will go into the final div that will look like the input
        var insideInput;
        if (!this.props.multiple || this.props.value.length > 0) {
          insideInput = selectedItems.concat(typingArea);
        } else {
          var position = selectedItems.length - this.state.cursorPosition;
          selectedItems.splice(position, 0, typingArea);
          insideInput = selectedItems;
        }

        // show a caret to indicate whether the input is open
        insideInput.push(React.DOM.span({
          key: "caret",
          className: "caret"
        }));

        var openClassName = "";
        if (this.state.open) {
          openClassName = "dropup";
        }

        var fakeInputProps = _.omit(_.extend({}, this.props, {
          ref: "fakeInput",
          onMouseDown: this.handleClick,
          className: "fancy-select-fake-input " + openClassName + " " + (this.props.className || "")
        }), "id", "onKeyDown", "onFocus", "onBlur", "placeholder");

        return React.DOM.div(fakeInputProps, insideInput);
      }
    });
  });