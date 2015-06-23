# Changelog

> **Tags:**
> - [New Feature]
> - [Bug Fix]
> - [Breaking Change]
> - [Documentation]
> - [Internal]
> - [Polish]

**Note**: Gaps between patch versions are faulty/broken releases.

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
