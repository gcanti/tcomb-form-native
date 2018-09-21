import React from "react";
import PropTypes from "prop-types";
import { Animated, View, TouchableOpacity, Text, Picker } from "react-native";

const UIPICKER_HEIGHT = 216;

class CollapsiblePickerIOS extends React.Component {
  constructor(props) {
    super(props);
    const isCollapsed =
      typeof this.props.locals.isCollapsed === typeof true
        ? this.props.locals.isCollapsed
        : true;

    this.state = {
      isCollapsed,
      height: new Animated.Value(isCollapsed ? 0 : UIPICKER_HEIGHT)
    };
    this.animatePicker = this._animatePicker.bind(this);
    this.togglePicker = this._togglePicker.bind(this);
    this.onValueChange = this._onValueChange.bind(this);
  }

  _animatePicker(isCollapsed) {
    const locals = this.props.locals;
    let animation = Animated.timing;
    let animationConfig = {
      duration: 200
    };
    if (locals.config) {
      if (locals.config.animation) {
        animation = locals.config.animation;
      }
      if (locals.config.animationConfig) {
        animationConfig = locals.config.animationConfig;
      }
    }
    animation(
      this.state.height,
      Object.assign(
        {
          toValue: isCollapsed ? 0 : UIPICKER_HEIGHT
        },
        animationConfig
      )
    ).start();
  }

  _togglePicker() {
    this.setState({ isCollapsed: !this.state.isCollapsed }, () => {
      this.animatePicker(this.state.isCollapsed);
      if (typeof this.props.locals.onCollapseChange === "function") {
        this.props.locals.onCollapseChange(this.state.isCollapsed);
      }
    });
  }

  _onValueChange(val) {
    const { onChange, value } = this.props.locals;
    if (val !== value) {
      this.togglePicker();
      onChange(val);
    }
  }

  render() {
    const locals = this.props.locals;
    const { stylesheet } = locals;
    let pickerContainer = stylesheet.pickerContainer.normal;
    let pickerContainerOpen = stylesheet.pickerContainer.open;
    let selectStyle = stylesheet.select.normal;
    let touchableStyle = stylesheet.pickerTouchable.normal;
    let touchableStyleActive = stylesheet.pickerTouchable.active;
    let pickerValue = stylesheet.pickerValue.normal;
    if (locals.hasError) {
      pickerContainer = stylesheet.pickerContainer.error;
      selectStyle = stylesheet.select.error;
      touchableStyle = stylesheet.pickerTouchable.error;
      pickerValue = stylesheet.pickerValue.error;
    }

    if (locals.disabled) {
      touchableStyle = stylesheet.pickerTouchable.notEditable;
    }

    const options = locals.options.map(({ value, text }) => (
      <Picker.Item key={value} value={value} label={text} />
    ));
    const selectedOption = locals.options.find(
      option => option.value === locals.value
    );

    const height = this.state.isCollapsed ? 0 : UIPICKER_HEIGHT;

    return (
      <View
        style={[
          pickerContainer,
          !this.state.isCollapsed ? pickerContainerOpen : {}
        ]}
      >
        <TouchableOpacity
          disabled={locals.disabled}
          style={[
            touchableStyle,
            this.state.isCollapsed ? {} : touchableStyleActive
          ]}
          onPress={this.togglePicker}
        >
          <Text style={pickerValue}>{selectedOption.text}</Text>
        </TouchableOpacity>
        <Animated.View
          style={{ height: this.state.height, overflow: "hidden" }}
        >
          <Picker
            accessibilityLabel={locals.label}
            ref="input"
            style={selectStyle}
            selectedValue={locals.value}
            onValueChange={this.onValueChange}
            help={locals.help}
            enabled={!locals.disabled}
            mode={locals.mode}
            prompt={locals.prompt}
            itemStyle={locals.itemStyle}
          >
            {options}
          </Picker>
        </Animated.View>
      </View>
    );
  }
}

CollapsiblePickerIOS.propTypes = {
  locals: PropTypes.object.isRequired
};

function select(locals) {
  if (locals.hidden) {
    return null;
  }

  const stylesheet = locals.stylesheet;
  let formGroupStyle = stylesheet.formGroup.normal;
  let controlLabelStyle = stylesheet.controlLabel.normal;
  let selectStyle = stylesheet.select.normal;
  let helpBlockStyle = stylesheet.helpBlock.normal;
  let errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    selectStyle = stylesheet.select.error;
    helpBlockStyle = stylesheet.helpBlock.error;
  }

  const label = locals.label ? (
    <Text style={controlLabelStyle}>{locals.label}</Text>
  ) : null;
  const help = locals.help ? (
    <Text style={helpBlockStyle}>{locals.help}</Text>
  ) : null;
  const error =
    locals.hasError && locals.error ? (
      <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
        {locals.error}
      </Text>
    ) : null;

  var options = locals.options.map(({ value, text }) => (
    <Picker.Item key={value} value={value} label={text} />
  ));

  return (
    <View style={formGroupStyle}>
      {label}
      <CollapsiblePickerIOS locals={locals} />
      {help}
      {error}
    </View>
  );
}

module.exports = select;
