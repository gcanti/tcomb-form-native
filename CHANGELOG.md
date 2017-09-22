# Changelog

> **Tags:**
> - [New Feature]
> - [Bug Fix]
> - [Breaking Change]
> - [Documentation]
> - [Internal]
> - [Polish]

**Note**: Gaps between patch versions are faulty/broken releases.

## 0.6.9

- **Bug fix**
    - Android timepicker always open the current time (@francescjimenez)

## 0.6.8

- **New Feature**
    - allow disabling datepicker by passing disabled prop to touchableopacity we can disable the datepicker (@koenpunt)
- **Bug fix**
    - Add proper border color to select.ios when there is an error, fix #342 (@javiercr)

## 0.6.7

- **Bug fix**
    - fix #301, PR https://github.com/gcanti/tcomb-form-native/pull/329 (@danilvalov)

## 0.6.6

- **Polish**
    - Solves scroll view issues with text fields in Android, fix #301 (@alvaromb)

## v0.6.5

- **New Feature**
    - Added `onContentSizeChange` as an option for TextBox (@nemo)

## v0.6.4

- **New Feature**
    - Wrap TextInput in a View for More Customizable Styling, e.g. [Material Design Style Underlines](https://github.com/gcanti/tcomb-form-native/blob/master/docs/STYLESHEETS.md#material-design-style-underlines) (@kenleezle)

## v0.6.3

- **New Feature**
    - Ability to style picker container (@dbonner1987)

## v0.6.2

- **New Feature**
    - Make `underlineColorAndroid` transparent by default, fix #239 (@adamrainsby)

## v0.6.1

- **New Feature**
    - Added support for minDate and maxDate in Android TimePickerAndroid (@alvaromb)

## v0.6.0

- **Breaking Change**
    - Added collapsable iOS DatePicker (@alvaromb)
    - Added collapsable iOS Picker (@alvaromb)

## v0.5.3

- **Bug Fix**
    - `_nativeContainerInfo` no longer exists in React v15.2.0, use `_hostContainerInfo` instead, fix #195 (@gcanti)

## v0.5.2

- **New Feature**
    - add support for unions, fix #118 (@gcanti)
    - add support for lists, fix #80 (@gcanti)
- **Bug Fix**
    - allow to set a default value in Android date picker template, fix #187

## v0.5.1

- **New Feature**
    - Add onChange handler to TextInput, fix #168 (@gcanti)

## v0.5.0

- **Breaking Change**
    - upgrade to `tcomb-validation` ^3.0.0 (@gcanti)
    - React API must be now required from `react` package (@jebschiefer)
- **New Feature**
    - Updated support for TextInput props for RN>=0.25 (@alvaromb)

## v0.4.4

- **Bug Fix**
    - Revert to export method from 869dd50 (https://github.com/gcanti/tcomb-form-native/pull/160)

## v0.4.3

- **New Feature**
    - support hot reload, fix #132 (thanks @justim, @alvaromb)
    - add `hidden` option [docs](https://github.com/gcanti/tcomb-form-native#hidden-component) (thanks @miqmago)

## v0.4.2

- **Bug Fix**
    - Textbox component displays extra characters after `getValue()`, fix #142 (thanks @alvaromb)

## v0.4.1

- **New Feature**
    - Set `accessibilityLabel` and `accessibilityLiveRegion` attributes on form controls, fix #137 (thanks @ndarilek)

## v0.4.0

- **Breaking Change**
    - required react-native version >= 0.20.0
- **New Feature**
    - add support for Switch (Android), fix #60 (thanks @alvaromb)
    - Support for Android date and time pickers, fix #67 (thanks @alvaromb)
    - add support for webpack, fix #23
- **Documentation**
    - How to clear form after submit (thanks @shashi-dokania)
    - Dynamic forms example: how to change a form based on selection
    - Stylesheet guide (docs/STYLESHEETS.md)
- **Polish**
    - add travis CI
    - add ISSUE_TEMPLATE.md (new GitHub feature)

## v0.3.3

- **Bug Fix**
    - v0.16.0 Warning: Form(...): React component classes must extend React.Component, fix #83

## v0.3.2

- **Polish**
    - Map value to enum, fix #56

## v0.3.1

- **New Feature**
    - default templates are now split in standalone files, so you can cherry pick which ones to load
    - ability to customize templates, stylesheets and i18n without loading the default ones (improved docs)
    - porting of tcomb-form `getValidationErrorMessage` feature

    ```js
    var Age = t.refinement(t.Number, function (n) { return n >= 18; });

    // if you define a getValidationErrorMessage function, it will be called on validation errors
    Age.getValidationErrorMessage = function (value) {
      return 'bad age ' + value;
    };

    var Schema = t.struct({
      age: Age
    });
    ```

    - add support for nested forms, fix #43
        - add proper support for struct refinements
        - add support for struct label (bootstrap templates)

        **Example**

        ```js
        var Account = t.struct({
          email: t.String,
          profile: t.struct({
            name: t.String,
            surname: t.String
          })
        });

        var options = {
          label: <Text style={{fontSize: 30}}>Account</Text>,
          fields: {
            profile: {
              label: <Text style={{fontSize: 20}}>Profile</Text>
            }
          }
        };
        ```

        - add support for struct error (bootstrap templates)
- **Experimental**
    - add support for maybe structs

    **Example**

    ```js
    var Account = t.struct({
      email: t.String,
      profile: t.maybe(t.struct({
        name: t.String,
        surname: t.String
      }))
    });

    // user enters email: 'aaa', => result { email: 'aaa', profile: null }
    // user enters email: 'aaa', name: 'bbb' => validation error for surname
    // user enters email: 'aaa', name: 'bbb', surname: 'ccc' => result { email: 'aaa', profile: { name: 'bbb', surname: 'ccc' } }
    ```

## v0.3.0

- **Breaking Change**
    - Upgrade tcomb-validation to v2, fix #68

      Do not worry: the migration path should be seamless since the major version bump was caused by dropping the support for bower (i.e. types and combinators are the same).
Just notice that the short type alias (`t.Str`, `t.Num`, ...) are deprecated in favour of the long ones (`t.String`, `t.Number`, ...) and the `subtype` combinator has now a more descriptive alias `refinement`.
- **Bug Fix**
    - amend struct onChange, fix #70

    the previous code would lead to bugs regarding error messages when the
    type is a subtype of a struct, https://github.com/gcanti/tcomb-form/issues/235
- **Internal**
    - move peer dependencies to dependencies

## v0.2.8

- **New Feature**
    - Pass in config options to custom template through options, fix #63

## v0.2.7

- **Internal**
    - support react-native versions greater than 0.9

## v0.2.6

- **Internal**
    - pin react-native version to 0.9

## v0.2.5

- **New Feature**
    + Add `required` field to i18n, fix #46
- **Internal**
    + upgrade to react-native v0.9

## v0.2.4

- **Bug Fix**
    + the default date for DatePicker is reflected in the UI but not in the `getValue()` API #42

## v0.2.3

- **New Feature**
    + add auto option override for specific field #41

## v0.2.2

- **Internal**
    + Recommend making peerDependencies more flexible #30

## v0.2.1

- **Internal**
    + less padding to textboxes, #31

## v0.2.0

- **New Feature**
    + getComponent API fix #19
    + get access to the native input contained in tcomb-form-native's component fix #24
- **Breaking Change**
    + Inputs refactoring, this affects how to build custom inputs #12
- **Internal**
    + Textbox is no more a controlled input #26
    + Add eslint

## v0.1.9

- **Internal**
    + upgrade to react-native v0.5.0 fix #22

## v0.1.8

- **Internal**
    - upgrade to react-native v0.4.3
    - upgrade to tcomb-validation v1.0.4

## v0.1.7

- **Internal**
    - upgrade to react-native v0.4.0

## v0.1.6

- **Internal**
    - upgrade to react-native v0.3.4
    - added tests
- **New Feature**
    - add path field to contexts in order to provide correct error paths for validations, fix #5
    - added a path argument to onChange in order to know what field changed
    - added support for transformers (all components)
    - Password field type, fix #4
- **Bug Fix**
    - Error with decimal mark in numeric field, fix #7
