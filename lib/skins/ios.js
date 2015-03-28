'use strict';

var React = require('react-native');
var { View, Text, TextInput, SwitchIOS, PickerIOS } = React;
var merge = require('../util/merge');

var ERROR_COLOR = '#a94442';
var HELP_COLOR = '#999999';
var BORDER_COLOR = '#cccccc';
var DISABLED_COLOR = '#777777';
var DISABLED_BACKGROUND_COLOR = '#eeeeee';

var defaultContainerStyle =  {
  marginBottom: 10
};
var defaultLabelStyle = {
  marginBottom: 7,
  fontWeight: 'bold'
};
var defaultHelpStyle = {
  marginBottom: 2,
  color: HELP_COLOR
};
var defaultErrorStyle = {
  marginBottom: 2,
  color: ERROR_COLOR
};

function textbox(locals) {

  var styles = locals.styles;
  var containerStyle = styles.containerStyle || defaultContainerStyle;
  var labelStyle = styles.labelStyle || defaultLabelStyle;
  var inputStyle = styles.inputStyle || {
    height: 36,
    padding: 10,
    borderRadius: 4,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    marginBottom: 4
  };
  var helpStyle = styles.labelStyle || defaultHelpStyle;
  var errorStyle = styles.errorStyle || defaultErrorStyle;

  if (locals.hasError) {
    containerStyle = styles.errorContainerStyle || containerStyle;
    labelStyle = styles.errorLabelStyle || merge(labelStyle, {color: ERROR_COLOR});
    inputStyle = styles.inputStyle || merge(inputStyle, {borderColor: ERROR_COLOR});
    helpStyle = styles.errorHelpStyle || helpStyle;
  }

  if (locals.editable === false) {
    inputStyle = styles.notEditableInputStyle || merge(inputStyle, {
      color: DISABLED_COLOR,
      backgroundColor: DISABLED_BACKGROUND_COLOR
    });
  }

  var label = locals.label ? <Text style={labelStyle}>{locals.label}</Text> : null;
  var help = locals.help ? <Text style={helpStyle}>{locals.help}</Text> : null;
  var error = locals.hasError && locals.error ? <Text style={errorStyle}>{locals.error}</Text> : null;

  return (
    <View style={containerStyle}>
      {label}
      <TextInput
        autoCapitalize={locals.autoCapitalize}
        autoCorrect={locals.autoCorrect}
        autoFocus={locals.autoFocus}
        bufferDelay={locals.bufferDelay}
        clearButtonMode={locals.clearButtonMode}
        editable={locals.editable}
        keyboardType={locals.keyboardType}
        multiline={locals.multiline}
        onBlur={locals.onBlur}
        onEndEditing={locals.onEndEditing}
        onFocus={locals.onFocus}
        onSubmitEditing={locals.onSubmitEditing}
        placeholderTextColor={locals.placeholderTextColor}
        selectionState={locals.selectionState}
        onChangeText={(value) => locals.onChange(value)}
        placeholder={locals.placeholder}
        style={inputStyle}
        value={locals.value}
      />
      {help}
      {error}
    </View>
  );
}

function checkbox(locals) {

  var styles = locals.styles;
  var containerStyle = styles.containerStyle || defaultContainerStyle;
  var labelStyle = styles.labelStyle || defaultLabelStyle;
  var inputStyle = styles.inputStyle || {
    marginBottom: 4
  };
  var helpStyle = styles.labelStyle || defaultHelpStyle;
  var errorStyle = styles.errorStyle || defaultErrorStyle;

  if (locals.hasError) {
    containerStyle = styles.errorContainerStyle || containerStyle;
    labelStyle = styles.errorLabelStyle || merge(labelStyle, {color: ERROR_COLOR});
    inputStyle = styles.inputStyle || merge(inputStyle, {borderColor: ERROR_COLOR});
    helpStyle = styles.errorHelpStyle || helpStyle;
  }

  var label = locals.label ? <Text style={labelStyle}>{locals.label}</Text> : null;
  var help = locals.help ? <Text style={helpStyle}>{locals.help}</Text> : null;
  var error = locals.hasError && locals.error ? <Text style={errorStyle}>{locals.error}</Text> : null;

  return (
    <View style={containerStyle}>
      {label}
      <SwitchIOS
        disabled={locals.disabled}
        onTintColor={locals.onTintColor}
        thumbTintColor={locals.thumbTintColor}
        tintColor={locals.tintColor}
        style={inputStyle}
        onValueChange={(value) => locals.onChange(value)}
        value={locals.value}
      />
      {help}
      {error}
    </View>
  );
}

function select(locals) {

  var styles = locals.styles;
  var containerStyle = styles.containerStyle || defaultContainerStyle;
  var labelStyle = styles.labelStyle || defaultLabelStyle;
  var inputStyle = styles.inputStyle || {
    marginBottom: 4
  };
  var helpStyle = styles.labelStyle || defaultHelpStyle;
  var errorStyle = styles.errorStyle || defaultErrorStyle;

  if (locals.hasError) {
    containerStyle = styles.errorContainerStyle || containerStyle;
    labelStyle = styles.errorLabelStyle || merge(labelStyle, {color: ERROR_COLOR});
    inputStyle = styles.inputStyle || merge(inputStyle, {borderColor: ERROR_COLOR});
    helpStyle = styles.errorHelpStyle || helpStyle;
  }

  var label = locals.label ? <Text style={labelStyle}>{locals.label}</Text> : null;
  var help = locals.help ? <Text style={helpStyle}>{locals.help}</Text> : null;
  var error = locals.hasError && locals.error ? <Text style={errorStyle}>{locals.error}</Text> : null;

  var items = locals.items.map(({value, label}) => <PickerIOS.Item key={value} value={value} label={label} />);

  return (
    <View style={containerStyle}>
      {label}
      <PickerIOS
        style={inputStyle}
        selectedValue={locals.value}
        onValueChange={locals.onChange}
      >
        {items}
      </PickerIOS>
      {help}
      {error}
    </View>
  );
}

function struct(locals) {

  var rows = locals.order.map(function (name) {
    return locals.inputs[name];
  });

  return (
    <View>
      {rows}
    </View>
  );
}

module.exports = {
  name: 'ios',
  textbox,
  checkbox,
  select,
  struct
};