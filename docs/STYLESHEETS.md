# Stylesheets

There are several levels of customization in `tcomb-form-native`:

- stylesheets
- templates
- factories

Let's focus on the first one: stylesheets.

## Basics and tech details

Let's define a simple type useful in the following examples:

```js
const Type = t.struct({
  name: t.String
});
```

By default `tcomb-form-native` will display a textbox styled with a boostrap-like look and feel. The default stylesheet is defined [here](https://github.com/gcanti/tcomb-form-native/blob/master/lib/stylesheets/bootstrap.js).

This is the normal look and feel of a textbox (border: gray)

![](images/stylesheets/1.png)

and this is the look and feel when an error occurs (border: red)

![](images/stylesheets/2.png)

The style management is coded in the `lib/stylesheets/bootstrap` module, specifically by the following lines:

```js
textbox: {

  // the style applied wihtout errors
  normal: {
    color: '#000000',
    fontSize: 17,
    height: 36,
    padding: 7,
    borderRadius: 4,
    borderColor: '#cccccc', // <= relevant style here
    borderWidth: 1,
    marginBottom: 5
  },

  // the style applied when a validation error occours
  error: {
    color: '#000000',
    fontSize: 17,
    height: 36,
    padding: 7,
    borderRadius: 4,
    borderColor: '#a94442', // <= relevant style here
    borderWidth: 1,
    marginBottom: 5
  }

}
```

Depending on the state of the textbox, `tcomb-form-native` passes in the proper style to the `<TextInput />` RN component (code [here](https://github.com/gcanti/tcomb-form-native/blob/master/lib/templates/bootstrap/textbox.js)).

You can override the default stylesheet both locally and globally.

## Overriding the style locally

Say you want the text entered in a texbox being green:

```js
var t = require('tcomb-form-native');
var _ = require('lodash');

// clone the default stylesheet
const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

// overriding the text color
stylesheet.textbox.normal.color = '#00FF00';

const options = {
  fields: {
    name: {
      stylesheet: stylesheet // overriding the style of the textbox
    }
  }
};

...

// other forms in you app won't be affected
<t.form.Form type={Type} options={options} />
```

**Output**

![](images/stylesheets/3.png)

**Note**. This is the list of styles that you can override:

- textbox
  - normal
  - error
  - notEditable
- checkbox
  - normal
  - error
- select
  - normal
  - error
- datepicker
  - normal
  - error
- formGroup
- controlLabel
- helpBlock
- errorBlock
- textboxView

## Overriding the style globally

Just omit the `deepclone` call, the style will be applied to all textboxes

```js
var t = require('tcomb-form-native');

// overriding the text color for every textbox in every form of your app
t.form.Form.stylesheet.textbox.normal.color = '#00FF00';
```

## Examples

### Horizontal forms

Let's add a `surname` field:

```js
const Type = t.struct({
  name: t.String,
  surname: t.String
});
```

The default layout is vertical:

![](images/stylesheets/4.png)

I'll use flexbox in order to display the textboxes horizontally:

```js
var _ = require('lodash');

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.fieldset = {
  flexDirection: 'row'
};
stylesheet.formGroup.normal.flex = 1;
stylesheet.formGroup.error.flex = 1;

const options = {
  stylesheet: stylesheet
};
```

**Output**

![](images/stylesheets/5.png)

### Label on the left side

```js
var _ = require('lodash');

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.formGroup.normal.flexDirection = 'row';
stylesheet.formGroup.error.flexDirection = 'row';
stylesheet.textbox.normal.flex = 1;
stylesheet.textbox.error.flex = 1;

const options = {
  stylesheet: stylesheet
};
```

**Output**

![](images/stylesheets/6.png)


### Material Design Style Underlines

```js
var _ = require('lodash');

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.textbox.normal.borderWidth = 0;
stylesheet.textbox.error.borderWidth = 0;
stylesheet.textbox.normal.marginBottom = 0;
stylesheet.textbox.error.marginBottom = 0;

stylesheet.textboxView.normal.borderWidth = 0;
stylesheet.textboxView.error.borderWidth = 0;
stylesheet.textboxView.normal.borderRadius = 0;
stylesheet.textboxView.error.borderRadius = 0;
stylesheet.textboxView.normal.borderBottomWidth = 1;
stylesheet.textboxView.error.borderBottomWidth = 1;
stylesheet.textbox.normal.marginBottom = 5;
stylesheet.textbox.error.marginBottom = 5;

const options = {
  stylesheet: stylesheet
};
```

**Output**

![](images/stylesheets/7.png)

**Copyable parameter list**
stylesheet.formGroup.normal.marginBottom=10;
stylesheet.formGroup.error.marginBottom=10;
stylesheet.controlLabel.normal.color='#000000';
stylesheet.controlLabel.normal.fontSize=17;
stylesheet.controlLabel.normal.marginBottom=7;
stylesheet.controlLabel.normal.fontWeight='500';
stylesheet.controlLabel.error.color='#a94442';
stylesheet.controlLabel.error.fontSize=17;
stylesheet.controlLabel.error.marginBottom=7;
stylesheet.controlLabel.error.fontWeight='500';
stylesheet.helpBlock.normal.color='#999999';
stylesheet.helpBlock.normal.fontSize=17;
stylesheet.helpBlock.normal.marginBottom=2;
stylesheet.helpBlock.error.color='#999999';
stylesheet.helpBlock.error.fontSize=17;
stylesheet.helpBlock.error.marginBottom=2;
stylesheet.errorBlock.fontSize=17;
stylesheet.errorBlock.marginBottom=2;
stylesheet.errorBlock.color='#a94442';
stylesheet.textbox.normal.color='#000000';
stylesheet.textbox.normal.fontSize=17;
stylesheet.textbox.normal.height=36;
stylesheet.textbox.normal.padding=7;
stylesheet.textbox.normal.borderRadius=4;
stylesheet.textbox.normal.borderColor='#cccccc';
stylesheet.textbox.normal.borderWidth=1;
stylesheet.textbox.normal.marginBottom=5;
stylesheet.textbox.error.color='#000000';
stylesheet.textbox.error.fontSize=17;
stylesheet.textbox.error.height=36;
stylesheet.textbox.error.padding=7;
stylesheet.textbox.error.borderRadius=4;
stylesheet.textbox.error.borderColor='#a94442';
stylesheet.textbox.error.borderWidth=1;
stylesheet.textbox.error.marginBottom=5;
stylesheet.textbox.notEditable.fontSize=17;
stylesheet.textbox.notEditable.height=36;
stylesheet.textbox.notEditable.padding=7;
stylesheet.textbox.notEditable.borderRadius=4;
stylesheet.textbox.notEditable.borderColor='#cccccc';
stylesheet.textbox.notEditable.borderWidth=1;
stylesheet.textbox.notEditable.marginBottom=5;
stylesheet.textbox.notEditable.color='#777777';
stylesheet.textbox.notEditable.backgroundColor='#eeeeee';
stylesheet.checkbox.normal.marginBottom=4;
stylesheet.checkbox.error.marginBottom=4;
stylesheet.pickerContainer.normal.marginBottom=4;
stylesheet.pickerContainer.normal.borderRadius=4;
stylesheet.pickerContainer.normal.borderColor='#cccccc';
stylesheet.pickerContainer.normal.borderWidth=1;
stylesheet.pickerContainer.error.borderColor='#a94442';
// stylesheet.select.normal.android.paddingLeft=7;
// stylesheet.select.normal.android.color='#000000';
// stylesheet.select.error.android.paddingLeft=7;
// stylesheet.select.error.android.color='#a94442';
stylesheet.pickerTouchable.normal.height=44;
stylesheet.pickerTouchable.normal.flexDirection='row';
stylesheet.pickerTouchable.normal.alignItems='center';
stylesheet.pickerTouchable.error.height=44;
stylesheet.pickerTouchable.error.flexDirection='row';
stylesheet.pickerTouchable.error.alignItems='center';
stylesheet.pickerTouchable.active.borderBottomWidth=1;
stylesheet.pickerTouchable.active.borderColor='#cccccc';
stylesheet.pickerValue.normal.fontSize=17;
stylesheet.pickerValue.normal.paddingLeft=7;
stylesheet.pickerValue.error.fontSize=17;
stylesheet.pickerValue.error.paddingLeft=7;
stylesheet.datepicker.normal.marginBottom=4;
stylesheet.datepicker.error.marginBottom=4;
stylesheet.dateValue.normal.color = '#000000';
stylesheet.dateValue.normal.fontSize=17;
stylesheet.dateValue.normal.padding=7;
stylesheet.dateValue.normal.marginBottom=5;
stylesheet.dateValue.error.color='#a94442';
stylesheet.dateValue.error.fontSize=17;
stylesheet.dateValue.error.padding=7;
stylesheet.dateValue.error.marginBottom=5;
stylesheet.buttonText.fontSize=18;
stylesheet.buttonText.color='white';
stylesheet.buttonText.alignSelf='center';
stylesheet.button.height=36;
stylesheet.button.backgroundColor='#48BBEC';
stylesheet.button.borderColor='#48BBEC';
stylesheet.button.borderWidth=1;
stylesheet.button.borderRadius=8;
stylesheet.button.marginBottom=10;
stylesheet.button.alignSelf='stretch';
stylesheet.button.justifyContent='center';
