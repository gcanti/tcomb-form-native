# Setup

```
npm install tcomb-form-native
```

# Domain Driven Forms

The [tcomb library](https://github.com/gcanti/tcomb) provides a concise but expressive way to define domain models in JavaScript.

The [tcomb-validation library](https://github.com/gcanti/tcomb-validation) builds on tcomb, providing validation functions for tcomb domain models.

This library builds on those two and on the awesome react-native.

# Benefits

With tcomb-form-native you simply call `<Form type={Model} />` to generate a form based on that domain model. What does this get you?

1. Write a lot less code
2. Usability and accessibility for free (automatic labels, inline validation, etc)
3. No need to update forms when domain model changes


# Example

```js
// index.ios.js

'use strict';

var React = require('react-native');
var t = require('tcomb-form-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} = React;

var Form = t.form.Form;

var Person = t.struct({
  name: t.Str,              // a required string
  surname: t.maybe(t.Str),  // an optional string
  age: t.Num,               // a required number
  rememberMe: t.Bool        // a boolean
});

var options = {}; // optional rendering options...

var AwesomeProject = React.createClass({

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
    backgroundColor: '#fff',
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

### Result:

(Labels are auto generated)

![Result](docs/images/result.png)

### Preview after a validation error:

![Result after a validation error](docs/images/errorResult.png)

# Docs and API

Coming soon...

# License

MIT
