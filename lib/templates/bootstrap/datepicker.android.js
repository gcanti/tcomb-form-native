var React = require('react');
var { View, Text, DatePickerAndroid, TimePickerAndroid, TouchableNativeFeedback } = require('react-native');

function datepicker(locals) {
  if (locals.hidden) {
    return null;
  }

  var stylesheet = locals.stylesheet;
  var formGroupStyle = stylesheet.formGroup.normal;
  var controlLabelStyle = stylesheet.controlLabel.normal;
  var datepickerStyle = stylesheet.datepicker.normal;
  var helpBlockStyle = stylesheet.helpBlock.normal;
  var errorBlockStyle = stylesheet.errorBlock;
  var dateValueStyle = stylesheet.dateValue.normal;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    datepickerStyle = stylesheet.datepicker.error;
    helpBlockStyle = stylesheet.helpBlock.error;
    dateValueStyle = stylesheet.dateValue.error;
  }

  // Setup the picker mode
  var datePickerMode = 'date';
  if (locals.mode === 'date' || locals.mode === 'time') {
    datePickerMode = locals.mode;
  }

  /**
   * Check config locals for Android datepicker.
   * ``locals.config.background``: `TouchableNativeFeedback` background prop
   * ``locals.config.format``: Date format function
   */
  var formattedValue = String(locals.value);
  var background = TouchableNativeFeedback.SelectableBackground(); // eslint-disable-line new-cap
  if (locals.config) {
    if (locals.config.format) {
      formattedValue = locals.config.format(locals.value);
    }
    if (locals.config.background) {
      background = locals.config.background;
    }
  }

  var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
  var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
  var error = locals.hasError && locals.error ? <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>{locals.error}</Text> : null;
  var value = locals.value ? <Text style={dateValueStyle}>{formattedValue}</Text> : null;

  return (
    <View style={formGroupStyle}>
      <TouchableNativeFeedback
        accessible={true}
        ref="input"
        background={background}
        onPress={function () {
          if (datePickerMode === 'time') {
            TimePickerAndroid.open({is24Hour: true})
              .then(function (time) {
                if (time.action !== TimePickerAndroid.dismissedAction) {
                  var newTime = new Date();
                  newTime.setHours(time.hour);
                  newTime.setMinutes(time.minute);
                  locals.onChange(newTime);
                }
              });
          } else {
            DatePickerAndroid.open({date: locals.value || new Date()})
              .then(function (date) {
                if (date.action !== DatePickerAndroid.dismissedAction) {
                  var newDate = new Date(date.year, date.month, date.day);
                  locals.onChange(newDate);
                }
              });
          }
        }}>
        <View>
          {label}
          {value}
        </View>
      </TouchableNativeFeedback>
      {help}
      {error}
    </View>
  );
}

module.exports = datepicker;
