import React, { PropTypes } from 'react';
import { Animated, View, TouchableOpacity, Text, Picker } from 'react-native';

const UIPICKER_HEIGHT = 216;

class CollapsiblePickerIOS extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: true,
      height: new Animated.Value(0)
    };
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

    const options = locals.options.map(({value, text}) => <Picker.Item key={value} value={value} label={text} />);
    const selectedOption = locals.options.find(option => option.value === locals.value);

    const height = (this.state.isCollapsed) ? 0 : UIPICKER_HEIGHT;
    return (
      <View style={[pickerContainer, (!this.state.isCollapsed) ? pickerContainerOpen : {}]}>
        <TouchableOpacity style={[touchableStyle, this.state.isCollapsed ? {} : touchableStyleActive]}
          onPress={() => {
            animation(this.state.height, Object.assign({
              toValue: (this.state.isCollapsed) ? UIPICKER_HEIGHT : 0
            }, animationConfig)).start();
            this.setState({isCollapsed: !this.state.isCollapsed});
          }}>
          <Text style={pickerValue}>
            {selectedOption.text}
          </Text>
        </TouchableOpacity>
        <Animated.View style={{height: this.state.height, overflow: 'hidden'}}>
          <Picker
            accessibilityLabel={locals.label}
            ref="input"
            style={selectStyle}
            selectedValue={locals.value}
            onValueChange={locals.onChange}
            help={locals.help}
            enabled={locals.enabled}
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

  const label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
  const help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
  const error = locals.hasError && locals.error ? <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>{locals.error}</Text> : null;

  var options = locals.options.map(({value, text}) => <Picker.Item key={value} value={value} label={text} />);

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
