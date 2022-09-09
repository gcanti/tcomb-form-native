import React from "react";
import { View, Text, TouchableNativeFeedback } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

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
  var datePickerMode = locals.mode;
  if (
    datePickerMode !== "date" &&
    datePickerMode !== "time" &&
    datePickerMode !== "datetime"
  ) {
    throw new Error(`Unrecognized date picker format ${datePickerMode}`);
  }

  /**
   * Check config locals for Android datepicker.
   * `locals.config.background: `TouchableNativeFeedback` background prop
   * `locals.config.format`: Date format function
   * `locals.config.dialogMode`: 'calendar', 'spinner', 'default'
   * `locals.config.dateFormat`: Date only format
   * `locals.config.timeFormat`: Time only format
   */
  var formattedValue = locals.value ? String(locals.value) : "";
  var background = TouchableNativeFeedback.SelectableBackground(); // eslint-disable-line new-cap
  var dialogMode = "default";
  var formattedDateValue = locals.value ? locals.value.toDateString() : "";
  var formattedTimeValue = locals.value ? locals.value.toTimeString() : "";
  if (locals.config) {
    if (locals.config.format && formattedValue) {
      formattedValue = locals.config.format(locals.value);
    } else if (!formattedValue) {
      formattedValue = locals.config.defaultValueText
        ? locals.config.defaultValueText
        : `Tap here to select a ${datePickerMode}`;
    }
    if (locals.config.background) {
      background = locals.config.background;
    }
    if (locals.config.dialogMode) {
      dialogMode = locals.config.dialogMode;
    }
    if (locals.config.dateFormat && formattedDateValue) {
      formattedDateValue = locals.config.dateFormat(locals.value);
    } else if (!formattedDateValue) {
      formattedDateValue = locals.config.defaultValueText
        ? locals.config.defaultValueText
        : "Tap here to select a date";
    }
    if (locals.config.timeFormat && formattedTimeValue) {
      formattedTimeValue = locals.config.timeFormat(locals.value);
    } else if (!formattedTimeValue) {
      formattedTimeValue = locals.config.defaultValueText
        ? locals.config.defaultValueText
        : "Tap here to select a time";
    }
  }

  var label = locals.label ? (
    <Text style={controlLabelStyle}>{locals.label}</Text>
  ) : null;
  var help = locals.help ? (
    <Text style={helpBlockStyle}>{locals.help}</Text>
  ) : null;
  var error =
    locals.hasError && locals.error ? (
      <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
        {locals.error}
      </Text>
    ) : null;
  var value = formattedValue ? (
    <Text style={dateValueStyle}>
      {datePickerMode === "date"
        ? formattedDateValue
        : datePickerMode === "time"
          ? formattedTimeValue
          : formattedValue}
    </Text>
  ) : null;

  return (
    <View style={formGroupStyle}>
      {datePickerMode === "datetime" ? (
        <View style={datepickerStyle}>
          {label}
          <TouchableNativeFeedback
            accessible={true}
            disabled={locals.disabled}
            background={background}
            onPress={function() {
              let config = {
                mode: "date",
                value: locals.value || new Date(),
                display: dialogMode,
                onChange: (_, date) => {
                  var newDate = new Date(locals.value);
                  newDate.setFullYear(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                  );
                  locals.onChange(newDate);
                }
              };
              if (locals.minimumDate) {
                config.minimumDate = locals.minimumDate;
              }
              if (locals.maximumDate) {
                config.maximumDate = locals.maximumDate;
              }
              DateTimePickerAndroid.open(config);
              if (typeof locals.onPress === "function") {
                locals.onPress();
              }
            }}
          >
            <View>
              <Text style={dateValueStyle}>{formattedDateValue}</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            accessible={true}
            disabled={locals.disabled}
            background={background}
            onPress={function() {
              const value = locals.value || new Date();
              DateTimePickerAndroid.open({
                mode: "time",
                value,
                is24Hour: true,
                onChange: (_, time) => {
                  const newTime = new Date(locals.value);
                  newTime.setHours(time.getHours());
                  newTime.setMinutes(time.getMinutes());
                  locals.onChange(newTime);
                }
              });
              if (typeof locals.onPress === "function") {
                locals.onPress();
              }
            }}
          >
            <View>
              <Text style={dateValueStyle}>{formattedTimeValue}</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      ) : (
        <TouchableNativeFeedback
          accessible={true}
          disabled={locals.disabled}
          background={background}
          onPress={function() {
            if (datePickerMode === "time") {
              const value = locals.value || new Date();
              DateTimePickerAndroid.open({
                mode: "time",
                value,
                is24Hour: true,
                onChange: (_, time) => {
                  locals.onChange(time);
                }
              });
            } else if (datePickerMode === "date") {
              let config = {
                mode: "date",
                value: locals.value || new Date(),
                display: dialogMode,
                onChange: (_, date) => {
                  locals.onChange(date);
                }
              };
              if (locals.minimumDate) {
                config.minimumDate = locals.minimumDate;
              }
              if (locals.maximumDate) {
                config.maximumDate = locals.maximumDate;
              }
              DateTimePickerAndroid.open(config);
            }
            if (typeof locals.onPress === "function") {
              locals.onPress();
            }
          }}
        >
          <View>
            {label}
            {value}
          </View>
        </TouchableNativeFeedback>
      )}
      {help}
      {error}
    </View>
  );
}

module.exports = datepicker;
