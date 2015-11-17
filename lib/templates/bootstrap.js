/*

  a bootstrap like layout
  use it with a proper stylesheet (e.g. ../stylesheets/bootstrap)

*/
'use strict';

var { React, merge } = require('../util');
var { View, Text, TextInput, SwitchIOS, PickerIOS, DatePickerIOS } = React;

// This is the default template for textboxes
function textbox(locals) {

  var stylesheet = locals.stylesheet;
  var formGroupStyle = stylesheet.formGroup.normal;
  var controlLabelStyle = stylesheet.controlLabel.normal;
  var textboxStyle = stylesheet.textbox.normal;
  var helpBlockStyle = stylesheet.helpBlock.normal;
  var errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    textboxStyle = stylesheet.textbox.error;
    helpBlockStyle = stylesheet.helpBlock.error;
  }

  if (locals.editable === false) {
    textboxStyle = stylesheet.textbox.notEditable;
  }

  var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
  var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
  var error = locals.hasError && locals.error ? <Text style={errorBlockStyle}>{locals.error}</Text> : null;

  return (
    <View style={formGroupStyle}>
      {label}
      <TextInput
        ref="input"
        autoCapitalize={locals.autoCapitalize}
        autoCorrect={locals.autoCorrect}
        autoFocus={locals.autoFocus}
        bufferDelay={locals.bufferDelay}
        clearButtonMode={locals.clearButtonMode}
        editable={locals.editable}
        enablesReturnKeyAutomatically={locals.enablesReturnKeyAutomatically}
        keyboardType={locals.keyboardType}
        multiline={locals.multiline}
        onBlur={locals.onBlur}
        onEndEditing={locals.onEndEditing}
        onFocus={locals.onFocus}
        onSubmitEditing={locals.onSubmitEditing}
        password={locals.password}
        placeholderTextColor={locals.placeholderTextColor}
        returnKeyType={locals.returnKeyType}
        selectTextOnFocus={locals.selectTextOnFocus}
        secureTextEntry={locals.secureTextEntry}
        selectionState={locals.selectionState}
        onChangeText={(value) => locals.onChange(value)}
        placeholder={locals.placeholder}
        maxLength={locals.maxLength}
        numberOfLines={locals.numberOfLines}
        textAlign={locals.textAlign}
        textAlignVertical={locals.textAlignVertical}
        underlineColorAndroid={locals.underlineColorAndroid}
        style={textboxStyle}
        value={locals.value}
      />
      {help}
      {error}
    </View>
  );
}

function checkbox(locals) {

  var stylesheet = locals.stylesheet;
  var formGroupStyle = stylesheet.formGroup.normal;
  var controlLabelStyle = stylesheet.controlLabel.normal;
  var checkboxStyle = stylesheet.checkbox.normal;
  var helpBlockStyle = stylesheet.helpBlock.normal;
  var errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    checkboxStyle = stylesheet.checkbox.error;
    helpBlockStyle = stylesheet.helpBlock.error;
  }

  var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
  var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
  var error = locals.hasError && locals.error ? <Text style={errorBlockStyle}>{locals.error}</Text> : null;

  return (
    <View style={formGroupStyle}>
      {label}
      <SwitchIOS
        ref="input"
        disabled={locals.disabled}
        onTintColor={locals.onTintColor}
        thumbTintColor={locals.thumbTintColor}
        tintColor={locals.tintColor}
        style={checkboxStyle}
        onValueChange={(value) => locals.onChange(value)}
        value={locals.value}
      />
      {help}
      {error}
    </View>
  );
}

function select(locals) {

  var stylesheet = locals.stylesheet;
  var formGroupStyle = stylesheet.formGroup.normal;
  var controlLabelStyle = stylesheet.controlLabel.normal;
  var selectStyle = stylesheet.select.normal;
  var helpBlockStyle = stylesheet.helpBlock.normal;
  var errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    selectStyle = stylesheet.select.error;
    helpBlockStyle = stylesheet.helpBlock.error;
  }

  var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
  var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
  var error = locals.hasError && locals.error ? <Text style={errorBlockStyle}>{locals.error}</Text> : null;

  var options = locals.options.map(({value, text}) => <PickerIOS.Item key={value} value={value} label={text} />);

  return (
    <View style={formGroupStyle}>
      {label}
      <PickerIOS
        ref="input"
        style={selectStyle}
        selectedValue={locals.value}
        onValueChange={locals.onChange}
      >
        {options}
      </PickerIOS>
      {help}
      {error}
    </View>
  );
}

function datepicker(locals) {

  var stylesheet = locals.stylesheet;
  var formGroupStyle = stylesheet.formGroup.normal;
  var controlLabelStyle = stylesheet.controlLabel.normal;
  var datepickerStyle = stylesheet.datepicker.normal;
  var helpBlockStyle = stylesheet.helpBlock.normal;
  var errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    datepickerStyle = stylesheet.datepicker.error;
    helpBlockStyle = stylesheet.helpBlock.error;
  }

  var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
  var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
  var error = locals.hasError && locals.error ? <Text style={errorBlockStyle}>{locals.error}</Text> : null;

  return (
    <View style={formGroupStyle}>
      {label}
      <DatePickerIOS
        ref="input"
        maximumDate={locals.maximumDate}
        minimumDate={locals.minimumDate}
        minuteInterval={locals.minuteInterval}
        mode={locals.mode}
        timeZoneOffsetInMinutes={locals.timeZoneOffsetInMinutes}
        style={datepickerStyle}
        onDateChange={(value) => locals.onChange(value)}
        date={locals.value}
      />
      {help}
      {error}
    </View>
  );
}

function struct(locals) {

  var stylesheet = locals.stylesheet;
  var fieldsetStyle = stylesheet.fieldset;
  var controlLabelStyle = stylesheet.controlLabel.normal;

  if (locals.hasError) {
    controlLabelStyle = stylesheet.controlLabel.error;
  }

  var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
  var error = locals.hasError && locals.error ? <Text style={stylesheet.errorBlock}>{locals.error}</Text> : null;

  var rows = locals.order.map(function (name) {
    return locals.inputs[name];
  });

  return (
    <View style={fieldsetStyle}>
      {label}
      {error}
      {rows}
    </View>
  );
}

module.exports = {
  textbox,
  checkbox,
  select,
  datepicker,
  struct
};
