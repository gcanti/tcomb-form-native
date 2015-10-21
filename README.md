# Setup

```
npm install tcomb-form-native
```

### Domain Driven Forms

The [tcomb library](https://github.com/gcanti/tcomb) provides a concise but expressive way to define domain models in JavaScript.

The [tcomb-validation library](https://github.com/gcanti/tcomb-validation) builds on tcomb, providing validation functions for tcomb domain models.

This library builds on those two and the awesome react-native.

### Benefits

With **tcomb-form-native** you simply call `<Form type={Model} />` to generate a form based on that domain model. What does this get you?

1. Write a lot less code
2. Usability and accessibility for free (automatic labels, inline validation, etc)
3. No need to update forms when domain model changes

### JSON Schema support

JSON Schemas are also supported via the (tiny) [tcomb-json-schema library](https://github.com/gcanti/tcomb-json-schema).

### Pluggable look and feel

The look and feel is customizable via react-native stylesheets and *templates* (see documentation).

### Screencast

http://react.rocks/example/tcomb-form-native

# Example

```js
// index.ios.js

'use strict';

var React = require('react-native');
var t = require('tcomb-form-native');
var { AppRegistry, StyleSheet, Text, View, TouchableHighlight } = React;

var Form = t.form.Form;

// here we are: define your domain model
var Person = t.struct({
  name: t.Str,              // a required string
  surname: t.maybe(t.Str),  // an optional string
  age: t.Num,               // a required number
  rememberMe: t.Bool        // a boolean
});

var options = {}; // optional rendering options (see documentation)

var AwesomeProject = React.createClass({

  onPress: function () {
    // call getValue() to get the values of the form
    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
      console.log(value); // value here is an instance of Person
    }
  },

  render: function() {
    return (
      <View style={styles.container}>
        {/* display */}
        <Form
          ref="form"
          type={Person}
          options={options}
        />
        <TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableHighlight>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
```

**Output:**

(Labels are automatically generated)

![Result](docs/images/result.png)

**Ouput after a validation error:**

![Result after a validation error](docs/images/validation.png)

# API

## `getValue()`

Returns `null` if the validation failed, an instance of your model otherwise.

> **Note**. Calling `getValue` will cause the validation of all the fields of the form, including some side effects like highlighting the errors.

## `validate()`

Returns a `ValidationResult` (see [tcomb-validation](https://github.com/gcanti/tcomb-validation) for a reference documentation).

## Adding a default value and listen to changes

The `Form` component behaves like a [controlled component](https://facebook.github.io/react/docs/forms.html):

```js
var Person = t.struct({
  name: t.Str,
  surname: t.maybe(t.Str)
});

var AwesomeProject = React.createClass({

  getInitialState() {
    return {
      value: {
        name: 'Giulio',
        surname: 'Canti'
      }
    };
  },

  onChange(value) {
    this.setState({value});
  },

  onPress: function () {
    var value = this.refs.form.getValue();
    if (value) {
      console.log(value);
    }
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Form
          ref="form"
          type={Person}
          value={this.state.value}
          onChange={this.onChange}
        />
        <TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableHighlight>
      </View>
    );
  }
});
```

The `onChange` handler has the following signature:

```
(raw: any, path: Array<string | number>) => void
```

where

- `raw` contains the current raw value of the form (can be an invalid value for your model)
- `path` is the path to the field triggering the change

> **Warning**. tcomb-form-native uses `shouldComponentUpdate` aggressively. In order to ensure that tcomb-form-native detect any change to `type`, `options` or `value` props you have to change references:

## Disable a field based on another field's value

```js
var Type = t.struct({
  disable: t.Bool, // if true, name field will be disabled
  name: t.Str
});

// see the "Rendering options" section in this guide
var options = {
  fields: {
    name: {}
  }
};

var AwesomeProject = React.createClass({

  getInitialState() {
    return {
      options: options,
      value: null
    };
  },

  onChange(value) {
    // tcomb immutability helpers
    // https://github.com/gcanti/tcomb/blob/master/GUIDE.md#updating-immutable-instances
    var options = t.update(this.state.options, {
      fields: {
        name: {
          editable: {'$set': !value.disable}
        }
      }
    });
    this.setState({options: options, value: value});
  },

  onPress: function () {
    var value = this.refs.form.getValue();
    if (value) {
      console.log(value);
    }
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Form
          ref="form"
          type={Type}
          options={this.state.options}
          value={this.state.value}
          onChange={this.onChange}
        />
        <TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableHighlight>
      </View>
    );
  }

});
```

## How to get access to a field

You can get access to a field with the `getComponent(path)` API:

```js
var Person = t.struct({
  name: t.Str,
  surname: t.maybe(t.Str),
  age: t.Num,
  rememberMe: t.Bool
});

var AwesomeProject = React.createClass({

  componentDidMount() {
    // give focus to the name textbox
    this.refs.form.getComponent('name').refs.input.focus();
  },

  onPress: function () {
    var value = this.refs.form.getValue();
    if (value) {
      console.log(value);
    }
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Form
          ref="form"
          type={Person}
        />
        <TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableHighlight>
      </View>
    );
  }
});
```

# Types

### Required field

By default fields are required:

```js
var Person = t.struct({
  name: t.Str,    // a required string
  surname: t.Str  // a required string
});
```

### Optional field

In order to create an optional field, wrap the field type with the `t.maybe` combinator:

```js
var Person = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str) // an optional string
});
```

The postfix `" (optional)"` is automatically added to optional fields.

You can customise the postfix value or setting a postfix for required fields:

```js
t.form.Form.i18n = {
  optional: '',
  required: ' (required)' // inverting the behaviour: adding a postfix to the required fields
};
```

### Numbers

In order to create a numeric field, use the `t.Num` type:

```js
var Person = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str),
  age: t.Num // a numeric field
});
```

tcomb-form-native will convert automatically numbers to / from strings.

### Booleans

In order to create a boolean field, use the `t.Bool` type:

```js
var Person = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str),
  age: t.Num,
  rememberMe: t.Bool // a boolean field
});
```

Booleans are displayed as `SwitchIOS`s.

### Dates

In order to create a date field, use the `t.Dat` type:

```js
var Person = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str),
  age: t.Num,
  birthDate: t.Dat // a date field
});
```

Dates are displayed as `DatePickerIOS`s.

### Enums

In order to create an enum field, use the `t.enums` combinator:

```js
var Gender = t.enums({
  M: 'Male',
  F: 'Female'
});

var Person = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str),
  age: t.Num,
  rememberMe: t.Bool,
  gender: Gender // enum
});
```

Enums are displayed as `PickerIOS`s.

### Subtypes

A *predicate* is a function with the following signature:

```
(x: any) => boolean
```

You can refine a type with the `t.subtype(type, predicate)` combinator:

```js
// a type representing positive numbers
var Positive = t.subtype(t.Num, function (n) {
  return n >= 0;
});

var Person = t.struct({
  name: t.Str,
  surname: t.Str,
  email: t.maybe(t.Str),
  age: Positive, // refinement
  rememberMe: t.Bool,
  gender: Gender
});
```

Subtypes allow you to express any custom validation with a simple predicate.

# Rendering options

In order to customize the look and feel, use an `options` prop:

```js
<Form type={Model} options={options} />
```

## Form component

### Labels

By default labels are automatically generated. You can turn off this behaviour or override the default labels
on field basis.

### Placeholders

In order to automatically generate default placeholders, use the option `auto: 'placeholders'`:

```js
var options = {
  auto: 'placeholders'
};

<Form type={Person} options={options} />
```

![Placeholders](docs/images/placeholders.png)

Set `auto: 'none'` if you don't want neither labels nor placeholders.

```js
var options = {
  auto: 'none'
};
```

### Fields order

You can sort the fields with the `order` option:

```js
var options = {
  order: ['name', 'surname', 'rememberMe', 'gender', 'age', 'email']
};
```

### Default values

You can set the default values passing a `value` prop to the `Form` component:

```js
var value = {
  name: 'Giulio',
  surname: 'Canti',
  age: 41,
  gender: 'M'
};

<Form type={Model} value={value} />
```

### Fields configuration

You can configure each field with the `fields` option:

```js
var options = {
  fields: {
    name: {
      // name field configuration here..
    },
    surname: {
      // surname field configuration here..
    }
  }
});
```

## Textbox component

Implementation: `TextInput`

**Tech note.** Values containing only white spaces are converted to `null`.

### Placeholder

You can set the placeholder with the `placeholder` option:

```js
var options = {
  fields: {
    name: {
      placeholder: 'Your placeholder here'
    }
  }
};
```

### Label

You can set the label with the `label` option:

```js
var options = {
  fields: {
    name: {
      label: 'Insert your name'
    }
  }
};
```

### Help message

You can set a help message with the `help` option:

```js
var options = {
  fields: {
    name: {
      help: 'Your help message here'
    }
  }
};
```

![Help](docs/images/help.png)

### Error messages

You can set a custom error message with the `error` option:

```js
var options = {
  fields: {
    email: {
      error: 'Insert a valid email'
    }
  }
};
```

![Help](docs/images/error.png)

tcomb-form-native will show the error message when the field validation fails.
You can also use a function with the following signature:

```js
(value: any) => string
```

where the `value` param contains the current field value. The value returned by the function will be used as message.

### Other standard options

The following standard options are available (see http://facebook.github.io/react-native/docs/textinput.html):

- `autoCapitalize`
- `autoCorrect`
- `autoFocus`
- `bufferDelay`
- `clearButtonMode`
- `editable`
- `enablesReturnKeyAutomatically`
- `keyboardType`
- `multiline`
- `onBlur`
- `onEndEditing`
- `onFocus`
- `onSubmitEditing`
- `password`
- `placeholderTextColor`
- `returnKeyType`
- `selectTextOnFocus`
- `secureTextEntry`
- `selectionState`

## Checkbox component

Implementation: `SwitchIOS`

The following options are similar to the `Textbox` component's ones:

- `label`
- `help`
- `error`

### Other standard options

The following standard options are available (see http://facebook.github.io/react-native/docs/switchios.html):

- `disabled`
- `onTintColor`
- `thumbTintColor`
- `tintColor`

## Select component

Implementation: `PickerIOS`

The following options are similar to the `Textbox` component's ones:

- `label`
- `help`
- `error`

### `nullOption` option

You can customize the null option with the `nullOption` option:

```js
var options = {
  fields: {
    gender: {
      nullOption: {value: '', label: 'Choose your gender'}
    }
  }
};
```

You can remove the null option setting the `nullOption` option to `false`.

**Warning**: when you set `nullOption = false` you must also set the Form's `value` prop for the select field.

**Tech note.** A value equal to `nullOption.value` (default `''`) is converted to `null`.

### Options order

You can sort the options with the `order` option:

```js
var options = {
  fields: {
    gender: {
      order: 'asc' // or 'desc'
    }
  }
};
```

## DatePicker component

Implementation: `DatePickerIOS`

### Example

```js
var Person = t.struct({
  name: t.Str,
  birthDate: t.Dat
});
```

The following options are similar to the `Textbox` component's ones:

- `label`
- `help`
- `error`

### Other standard options

The following standard options are available (see http://facebook.github.io/react-native/docs/datepickerios.html):

- `maximumDate`,
- `minimumDate`,
- `minuteInterval`,
- `mode`,
- `timeZoneOffsetInMinutes`

# Customizations

## Stylesheets

tcomb-form-native comes with a default style. You can customize the look and feel by setting another stylesheet:

```js
var t = require('tcomb-form-native');

// define a stylesheet (see lib/stylesheets/bootstrap for an example)
var stylesheet = {...};

// override globally the default stylesheet
t.form.Form.stylesheet = stylesheet;
```

You can also override the stylesheet locally for selected fields:

```js
var Person = t.struct({
  name: t.Str
});

var options = {
  fields: {
    name: {
      stylesheet: myCustomStylesheet
    }
  }
};
```

Or per form:

```js
var Person = t.struct({
  name: t.Str
});

var options = {
  stylesheet: myCustomStylesheet
};
```

For a complete example see the default stylesheet https://github.com/gcanti/tcomb-form-native/blob/master/lib/stylesheets/bootstrap.js.

## Templates

tcomb-form-native comes with a default layout, i.e. a bunch of templates, one for each component.
When changing the stylesheet is not enough, you can customize the layout by setting custom templates:

```js
var t = require('tcomb-form-native');

// define the templates (see lib/templates/bootstrap for an example)
var templates = {...};

// override globally the default layout
t.form.Form.templates = templates;
```

You can also override the template locally:

```js
var Person = t.struct({
  name: t.Str
});

function myCustomTemplate(locals) {

  var containerStyle = {...};
  var labelStyle = {...};
  var textboxStyle = {...};

  return (
    <View style={containerStyle}>
      <Text style={labelStyle}>{locals.label}</Text>
      <TextInput style={textboxStyle} />
    </View>
  );
}

var options = {
  fields: {
    name: {
      template: myCustomTemplate
    }
  }
};
```

A template is a function with the following signature:

```
(locals: Object) => ReactElement
```

where `locals` is an object contaning the "recipe" for rendering the input and it's built for you by tcomb-form-native.
Let's see an example: the `locals` object passed in the `checkbox` template:

```js
{
  stylesheet: Object, // the styles to be applied
  hasError: boolean,  // true if there is a validation error
  error: ?string,     // the optional error message to be displayed
  label: string,      // the label to be displayed
  help: ?string,      // the optional help message to be displayed
  value: boolean,     // the current value of the checkbox
  onChange: Function, // the event handler to be called when the value changes
  config: Object,     // an optional object to pass configuration options to the new template

  ...other input options here...

}
```

For a complete example see the default template https://github.com/gcanti/tcomb-form-native/blob/master/lib/templates/bootstrap.js.

## Transformers

Say you want a search textbox which accepts a list of keywords separated by spaces:

```js
var Search = t.struct({
  search: t.list(t.Str)
});
```

tcomb-form by default will render the `search` field as a list. In order to render a textbox you have to override the default behaviour with the factory option:

```js
var options = {
  fields: {
    search: {
      factory: t.form.Textbox
    }
  }
};
```

There is a problem though: a textbox handle only strings so we need a way to transform a list in a string and a string in a list: a `Transformer` deals with serialization / deserialization of data and has the following interface:

```js
var Transformer = t.struct({
  format: t.Func, // from value to string, it must be idempotent
  parse: t.Func   // from string to value
});
```

A basic transformer implementation for the search textbox:

```js
var listTransformer = {
  format: function (value) {
    return Array.isArray(value) ? value.join(' ') : value;
  },
  parse: function (str) {
    return str ? str.split(' ') : [];
  }
};
```

Now you can handle lists using the transformer option:

```js
// example of initial value
var value = {
  search: ['climbing', 'yosemite']
};

var options = {
  fields: {
    search: {
      factory: t.form.Textbox, // tell tcomb-react-native to use the same component for textboxes
      transformer: listTransformer,
      help: 'Keywords are separated by spaces'
    }
  }
};
```

## Custom factories

You can pack together style, template (and transformers) in a custom component and then you can use it with the `factory` option:

```js
var Component = t.form.Component;

// extend the base Component
class MyComponent extends Component {

  // this is the only required method to implement
  getTemplate() {
    // define here your custom template
    return function (locals) {

      //return ... jsx ...

    };
  }

  // you can optionally override the default getLocals method
  // it will provide the locals param to your template
  getLocals() {

    // in locals you'll find the default locals:
    // - path
    // - error
    // - hasError
    // - label
    // - onChange
    // - stylesheet
    var locals = super.getLocals();

    // add here your custom locals

    return locals;
  }


}

// as example of transformer: this is the default transformer for textboxes
MyComponent.transformer = {
  format: value => Nil.is(value) ? null : value,
  parse: value => (t.Str.is(value) && value.trim() === '') || Nil.is(value) ? null : value
};

var Person = t.struct({
  name: t.Str
});

var options = {
  fields: {
    name: {
      factory: MyComponent
    }
  }
};
```

# Tests

```
npm test
```

# License

MIT
