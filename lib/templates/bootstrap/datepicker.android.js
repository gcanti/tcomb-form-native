var React = require('react-native');
var { View, Text, DatePickerAndroid, TimePickerAndroid, TouchableNativeFeedback } = React;

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

  /**
   * Check config locals for Android datepicker.
   * ``locals.config.mode``: Supported pickers: 'date', 'time'
   * ``locals.config.format``: Date format function: locals.config.format
   */
  var datePickerMode = "date";
  var formattedValue = String(locals.value);
  if (locals.config) {
    if (locals.config.mode && (locals.config.mode === "date" || locals.config.mode === "time")) {
      datePickerMode = locals.config.mode;
    }
    if (locals.config.format) {
      formattedValue = locals.config.format(locals.value);
    }
  }

  var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
  var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
  var error = locals.hasError && locals.error ? <Text style={errorBlockStyle}>{locals.error}</Text> : null;
  var value = locals.value ? <Text>{formattedValue}</Text> : null;

  return (
    <View style={formGroupStyle}>
      <TouchableNativeFeedback
        ref="input"
        background={locals.background}
        onPress={function () {
          if (datePickerMode === "time") {
            TimePickerAndroid.open({is24Hour: true})
              .then(function (time) {
                if (time.action !== TimePickerAndroid.dismissedAction) {
                  var newTime = new Date();
                  newTime.setHours(time.hour);
                  newTime.setMinutes(time.minute);
                  locals.onChange(newTime);
                }
              })
          } else {
            DatePickerAndroid.open({date: new Date()})
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
