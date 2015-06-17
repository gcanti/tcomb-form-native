'use strict';

var React = require('./util/React');
var t = require('tcomb-validation');
var humanize = require('./util/humanize');
var merge = require('./util/merge');
var getTypeInfo = require('./util/getTypeInfo');
var getOptionsOfEnum = require('./util/getOptionsOfEnum');

var SOURCE = 'tcomb-form-native';
var nooptions = Object.freeze({});
var noop = function () {};

function getComponent(type, options) {
  if (options.factory) {
    return options.factory;
  }
  var name = t.getTypeName(type);
  switch (type.meta.kind) {
    case 'irreducible' :
      return type === t.Bool ? Checkbox :
        type === t.Dat ? DatePicker : Textbox;
    case 'struct' :
      return Struct;
    case 'enums' :
      return Select;
    case 'maybe' :
    case 'subtype' :
      return getComponent(type.meta.type, options);
    default :
      t.fail(`[${SOURCE}] unsupported type ${name}`);
  }
}

function getDefaultLabel(ctx, typeInfo) {
  return ctx.label + (typeInfo.isMaybe ? ctx.i18n.optional : '');
}

function sortByText(a, b) {
  return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
}

function getComparator(order) {
  return {
    asc: sortByText,
    desc: (a, b) => -sortByText(a, b)
  }[order];
}

class Component extends React.Component {

  constructor(props) {
    super(props);
    this.typeInfo = getTypeInfo(props.type);
    this.state = {
      hasError: false,
      value: this.getTransformer().format(props.value)
    };
  }

  getTransformer() {
    if (this.props.options.transformer) {
      return this.props.options.transformer;
    }
    return Form.transformers.defaultTransformer;
  }

  shouldComponentUpdate(nextProps, nextState) {
    var should = (
      nextState.value !== this.state.value ||
      nextState.hasError !== this.state.hasError ||
      nextProps.options !== this.props.options ||
      nextProps.type !== this.props.type
    );
    return should;
  }

  componentWillReceiveProps(props) {
    var value = this.getTransformer().format(props.value);
    if (props.type !== this.props.type) {
      this.typeInfo = getTypeInfo(props.type);
    }
    this.setState({value});
  }

  onChange(value) {
    this.state.value = value;
    this.props.onChange(value, this.props.ctx.path);
  }

  getValue() {
    var result = this.validate();
    this.setState({hasError: !result.isValid()});
    return result;
  }

  validate() {
    var value = this.getTransformer().parse(this.state.value);
    return t.validate(value, this.props.type, this.props.ctx.path);
  }

  getLocals() {
    t.fail(`[${SOURCE}] unimplemented method getLocals() of component ${this.constructor.name}`);
  }

  render() {
    var locals = this.getLocals();
    return locals.template(locals);
  }

}

class Textbox extends Component {

  getTransformer() {
    if (this.props.options.transformer) {
      return this.props.options.transformer;
    }
    if (this.typeInfo.innerType === t.Num) {
      return Form.transformers.defaultNumberTransformer;
    }
    return Form.transformers.defaultTextboxTransformer;
  }

  getLocals() {

    var { ctx, options } = this.props;

    var defaultLabel = getDefaultLabel(ctx, this.typeInfo);
    var label = options.label;
    if (!label && ctx.auto === 'labels' && ctx.label) {
      label = defaultLabel;
    }
    var placeholder = options.placeholder;
    if (!label && !placeholder && ctx.auto === 'placeholders') {
      placeholder = defaultLabel;
    }
    var value = this.state.value;
    var error = t.Func.is(options.error) ? options.error(value) : options.error;
    var template = options.template || ctx.templates.textbox;
    var stylesheet = options.stylesheet || ctx.stylesheet;

    var locals = {
      error,
      hasError: options.hasError || this.state.hasError,
      label,
      onChange: this.onChange.bind(this),
      placeholder: placeholder,
      stylesheet,
      template,
      value
    };

    [
      'help',
      'autoCapitalize',
      'autoCorrect',
      'autoFocus',
      'bufferDelay',
      'clearButtonMode',
      'editable',
      'enablesReturnKeyAutomatically',
      'keyboardType',
      'multiline',
      'onBlur',
      'onEndEditing',
      'onFocus',
      'onSubmitEditing',
      'password',
      'placeholderTextColor',
      'returnKeyType',
      'selectTextOnFocus',
      'secureTextEntry',
      'selectionState'
    ].forEach((name) => locals[name] = options[name]);

    return locals;
  }

}

class Checkbox extends Component {

  getTransformer() {
    if (this.props.options.transformer) {
      return this.props.options.transformer;
    }
    return Form.transformers.defaultCheckboxTransformer;
  }

  getLocals() {

    var { ctx, options } = this.props;

    var label = options.label;
    if (!label && ctx.label) {
      label = getDefaultLabel(ctx, this.typeInfo);
    }
    var value = this.state.value;
    var error = t.Func.is(options.error) ? options.error(value) : options.error;
    var template = options.template || ctx.templates.checkbox;
    var stylesheet = options.stylesheet || ctx.stylesheet;

    var locals = {
      error,
      hasError: options.hasError || this.state.hasError,
      label,
      onChange: this.onChange.bind(this),
      stylesheet,
      template,
      value
    };

    [
      'help',
      'disabled',
      'onTintColor',
      'thumbTintColor',
      'tintColor'
    ].forEach((name) => locals[name] = options[name]);

    return locals;
  }

}

class Select extends Component {

  getNullOption() {
    return this.props.options.nullOption || {value: '', text: '-'};
  }

  getLocals() {

    var { ctx, options } = this.props;

    var label = options.label;
    if (!label && ctx.label) {
      label = getDefaultLabel(ctx, this.typeInfo);
    }
    var value = this.state.value;
    var error = t.Func.is(options.error) ? options.error(value) : options.error;
    var template = options.template || ctx.templates.select;
    var stylesheet = options.stylesheet || ctx.stylesheet;

    var items = options.options ? options.options.slice() : getOptionsOfEnum(this.typeInfo.innerType);
    if (options.order) {
      items.sort(getComparator(options.order));
    }
    var nullOption = this.getNullOption();
    if (options.nullOption !== false) {
      if (t.Nil.is(value)) { value = nullOption.value; }
      items.unshift(nullOption);
    }

    var locals = {
      error,
      hasError: options.hasError || this.state.hasError,
      options: items,
      label,
      onChange: this.onChange.bind(this),
      stylesheet,
      template,
      value
    };

    [
      'help'
    ].forEach((name) => locals[name] = options[name]);

    return locals;
  }

}

class DatePicker extends Component {

  constructor(props) {
    super(props);
  }

  getLocals() {

    var { ctx, options } = this.props;

    var label = options.label;
    if (!label && ctx.auto === 'labels' && ctx.label) {
      label = getDefaultLabel(ctx, this.typeInfo);
    }
    var value = this.state.value;

    var error = t.Func.is(options.error) ? options.error(value) : options.error;
    var template = options.template || ctx.templates.datepicker;
    var stylesheet = options.stylesheet || ctx.stylesheet;

    var locals = {
      error,
      hasError: options.hasError || this.state.hasError,
      label,
      onChange: this.onChange.bind(this),
      stylesheet,
      template,
      value
    };

    [
      'help',
      'maximumDate',
      'minimumDate',
      'minuteInterval',
      'mode',
      'timeZoneOffsetInMinutes'
    ].forEach((name) => locals[name] = options[name]);

    return locals;
  }

}

class Struct extends Component {

  constructor(props) {
    super(props);
  }

  validate() {

    var value = {};
    var errors = [];
    var hasError = false;
    var result;

    for (var ref in this.refs) {
      if (this.refs.hasOwnProperty(ref)) {
        result = this.refs[ref].getValue();
        errors = errors.concat(result.errors);
        value[ref] = result.value;
      }
    }

    if (errors.length === 0) {
      value = new this.typeInfo.innerType(value);
      if (this.typeInfo.isSubtype && errors.length === 0) {
        result = t.validate(value, this.props.type, this.props.ctx.path);
        hasError = !result.isValid();
        errors = errors.concat(result.errors);
      }
    }

    return new t.ValidationResult({errors, value});
  }

  onChange(fieldName, fieldValue, path) {
    var value = t.mixin({}, this.state.value);
    value[fieldName] = fieldValue;
    this.state.value = value;
    this.props.onChange(value, path);
  }

  getLocals() {

    var { ctx, options } = this.props;

    var props = this.typeInfo.innerType.meta.props;
    var order = options.order || Object.keys(props);
    var auto = options.auto || ctx.auto;
    var i18n =  options.i18n || ctx.i18n;
    var label = options.label;
    if (!label && auto === 'labels' && ctx.label) {
      label = ctx.label + (this.typeInfo.isMaybe ? i18n.optional : '');
    }
    var value = this.state.value || {};
    var templates = merge(ctx.templates, options.templates);
    var stylesheet = options.stylesheet || ctx.stylesheet;

    var inputs = {};
    for (var prop in props) {
      if (props.hasOwnProperty(prop)) {
        var propType = props[prop];
        var propOptions = options.fields && options.fields[prop] ? options.fields[prop] : nooptions;
        inputs[prop] = React.createElement(getComponent(propType, propOptions), {
          key: prop,
          ref: prop,
          type: propType,
          options: propOptions,
          value: value[prop],
          onChange: this.onChange.bind(this, prop),
          ctx: {
            auto,
            label: humanize(prop),
            i18n,
            stylesheet,
            templates,
            path: this.props.ctx.path.concat(prop)
          }
        });
      }
    }

    return {
      order,
      label,
      inputs,
      stylesheet,
      template: templates.struct
    };
  }

}

class Form {

  getValue(raw) {
    var result = this.refs.input.getValue();
    if (raw === true) { return result; }
    if (result.isValid()) { return result.value; }
    return null;
  }

  render() {

    var type = this.props.type;
    var options = this.props.options || nooptions;
    var stylesheet = Form.stylesheet;
    var templates = Form.templates;
    var i18n = Form.i18n;

    t.assert(t.Type.is(type), `[${SOURCE}] missing required prop type`);
    t.assert(t.Obj.is(options), `[${SOURCE}] prop options must be an object`);
    t.assert(t.Obj.is(stylesheet), `[${SOURCE}] missing stylesheet config`);
    t.assert(t.Obj.is(templates), `[${SOURCE}] missing templates config`);
    t.assert(t.Obj.is(i18n), `[${SOURCE}] missing i18n config`);

    var Component = getComponent(type, options);

    return React.createElement(Component, {
      ref: 'input',
      type: type,
      options: options,
      value: this.props.value,
      onChange: this.props.onChange || noop,
      ctx: {
        auto: 'labels',
        stylesheet,
        templates,
        i18n,
        path: []
      }
    });
  }

}

Form.transformers = {

  defaultTransformer: {
    format: value => t.Nil.is(value) ? null : value,
    parse: value => value
  },

  defaultNumberTransformer: {
    format: value => t.Nil.is(value) ? value : String(value),
    parse: value => {
      var n = parseFloat(value);
      var isNumeric = (value - n + 1) >= 0;
      return isNumeric ? n : value;
    }
  },

  defaultTextboxTransformer: {
    format: value => t.Nil.is(value) ? null : value,
    parse: value => (t.Str.is(value) && value.trim() === '') || t.Nil.is(value) ? null : value
  },

  defaultCheckboxTransformer: {
    format: value => t.Nil.is(value) ? false : value,
    parse: value => t.Nil.is(value) ? false : value
  }

};

module.exports = {
  Component,
  Textbox,
  Checkbox,
  Select,
  DatePicker,
  Struct,
  Form
};