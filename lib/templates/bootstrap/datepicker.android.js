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
   * ``locals.config.dialogMode``: 'calendar', 'spinner', 'default'
   */
  var formattedValue = String(locals.value);
  var background = TouchableNativeFeedback.SelectableBackground(); // eslint-disable-line new-cap
  var dialogMode = 'default';
  if (locals.config) {
    if (locals.config.format) {
      formattedValue = locals.config.format(locals.value);
    }
    if (locals.config.background) {
      background = locals.config.background;
    }
    if (locals.config.dialogMode) {
      dialogMode = locals.config.dialogMode;
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
        disabled={locals.disabled}
        ref="input"
        background={background}
        onPress={function () {
          if (datePickerMode === 'time') {
            const now = new Date();
            const isDate = locals.value && locals.value instanceof Date;
            let setTime = {
              hour: (isDate) ? locals.value.getHours() : now.getHours(),
              minute: (isDate) ? locals.value.getMinutes() : now.getMinutes()
            };
            TimePickerAndroid.open({is24Hour: true, hour: setTime.hour, minute: setTime.minute})
            .then(function (time) {
              if (time.action !== TimePickerAndroid.dismissedAction) {
                const newTime = new Date();
                newTime.setHours(time.hour);
                newTime.setMinutes(time.minute);
                locals.onChange(newTime);
              }
            });
          } else {
            let config = {
              date: locals.value || new Date(),
              mode: dialogMode
            };
            if (locals.minimumDate) {
              config.minDate = locals.minimumDate;
            }
            if (locals.maximumDate) {
              config.maxDate = locals.maximumDate;
            }
            DatePickerAndroid.open(config)
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
