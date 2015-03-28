'use strict';

var React = require('react-native');
var t = require('tcomb-validation');
var humanize = require('./util/humanize');
var merge = require('./util/merge');
var getTypeInfo = require('./util/getTypeInfo');
var getOptionsOfEnum = require('./util/getOptionsOfEnum');

var SOURCE = 'tcomb-form-native';
var nooptions = Object.freeze({});
var noop = function () {};

function getComponent(type, options) {
  if (options.component) {
    return options.component;
  }
  var name = t.getTypeName(type);
  switch (type.meta.kind) {
    case 'irreducible' :
      return type === t.Bool ? Checkbox : Textbox;
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

function sortByLabel(a, b) {
  return a.label < b.label ? -1 : a.label > b.label ? 1 : 0;
}

function getComparator(order) {
  return {
    asc: sortByLabel,
    desc: (a, b) => -sortByLabel(a, b)
  }[order];
}

var numberTransformer = {
  format: value => t.Nil.is(value) ? value : String(value),
  parse: value => {
    var n = parseFloat(value);
    var isNumeric = (value - n + 1) >= 0;
    return isNumeric ? n : value;
  }
};

class Component extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      value: this.normalize(props.value)
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.value !== this.state.value ||
      nextState.hasError !== this.state.hasError ||
      nextProps.value !== this.props.value ||
      nextProps.options !== this.props.options ||
      nextProps.type !== this.props.type;
  }

  componentWillReceiveProps(props) {
    this.setState({value: this.normalize(props.value)});
  }

  normalize(value) {
    return value;
  }

  onChange(value) {
    value = this.normalize(value);
    this.setState({value}, function () {
      this.props.onChange(value);
    }.bind(this));
  }

  getValue() {
    var result = this.validate();
    this.setState({hasError: !result.isValid()});
    return result;
  }

  validate() {
    return t.validate(this.state.value, this.props.type);
  }

  render() {
    t.assert(t.Func.is(this.getLocals), `[${SOURCE}] unimplemented method getLocals() of component ${this.constructor.name}`);
    var locals = this.getLocals();
    return locals.template(locals);
  }

}

class Textbox extends Component {

  constructor(props) {
    super(props);
  }

  normalize(value) {
    return (t.Str.is(value) && value.trim() === '') ? null :
      !t.Nil.is(value) ? value :
      null;
  }

  getLocals() {

    var typeInfo = getTypeInfo(this.props.type);
    var { ctx, options } = this.props;

    var defaultLabel = getDefaultLabel(ctx, typeInfo);
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

    var transformer = options.transformer;
    if (!transformer && typeInfo.innerType === t.Num) {
      transformer = numberTransformer;
    }
    if (transformer) {
      value = transformer.format(value);
    }

    var locals = {
      error,
      hasError: this.state.hasError,
      label,
      onChange: (value) => {
        if (transformer) { value = transformer.parse(value); }
        this.onChange(value);
      },
      placeholder: placeholder,
      styles: options.styles || nooptions,
      template,
      value
    };

    [
      'autoCapitalize',
      'autoCorrect',
      'autoFocus',
      'bufferDelay',
      'clearButtonMode',
      'editable',
      'keyboardType',
      'multiline',
      'onBlur',
      'onEndEditing',
      'onFocus',
      'onSubmitEditing',
      'placeholderTextColor',
      'selectionState',
      'help'
    ].forEach((name) => locals[name] = options[name]);

    return locals;
  }

}

class Checkbox extends Component {

  normalize(value) {
    return !!t.maybe(t.Bool)(value);
  }

  getLocals() {

    var typeInfo = getTypeInfo(this.props.type);
    var { ctx, options } = this.props;

    var label = options.label;
    if (!label && ctx.label) {
      label = getDefaultLabel(ctx, typeInfo);
    }
    var value = this.state.value;
    var error = t.Func.is(options.error) ? options.error(value) : options.error;
    var template = options.template || ctx.templates.checkbox;

    var locals = {
      error,
      hasError: this.state.hasError,
      label,
      onChange: this.onChange.bind(this),
      styles: options.styles || nooptions,
      template,
      value
    };

    [
      'disabled',
      'onTintColor',
      'thumbTintColor',
      'tintColor',
      'help'
    ].forEach((name) => locals[name] = options[name]);

    return locals;
  }

}

class Select extends Component {

  normalize(value) {
    var nullOption = this.getNullOption();
    if (value === nullOption.value) {
      value = null;
    }
    return value;
  }

  getNullOption() {
    return this.props.options.nullOption || {value: '', label: '-'};
  }

  getLocals() {

    var typeInfo = getTypeInfo(this.props.type);
    var { ctx, options } = this.props;

    var label = options.label;
    if (!label && ctx.label) {
      label = getDefaultLabel(ctx, typeInfo);
    }
    var value = this.state.value;
    var error = t.Func.is(options.error) ? options.error(value) : options.error;
    var template = options.template || ctx.templates.select;

    var items = options.items ? options.items.slice() : getOptionsOfEnum(typeInfo.innerType);
    if (options.order) {
      items.sort(getComparator(options.order));
    }
    var nullOption = this.getNullOption();
    if (options.nullOption !== false) {
      items.unshift(nullOption);
    }

    var locals = {
      error,
      hasError: this.state.hasError,
      items,
      label,
      onChange: this.onChange.bind(this),
      styles: options.styles || nooptions,
      template,
      value
    };

    [
      'help'
    ].forEach((name) => locals[name] = options[name]);

    return locals;
  }

}

class Struct extends Component {

  constructor(props) {
    super(props);
  }

  validate() {

    var typeInfo = getTypeInfo(this.props.type);
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
      value = new typeInfo.innerType(value);
      if (typeInfo.isSubtype && errors.length === 0) {
        result = t.validate(value, this.props.type);
        hasError = !result.isValid();
        errors = errors.concat(result.errors);
      }
    }

    return new t.ValidationResult({errors, value});
  }

  onChange(fieldName, fieldValue) {
    var value = t.mixin({}, this.state.value);
    value[fieldName] = fieldValue;
    this.setState({value}, function () {
      this.props.onChange(value);
    }.bind(this));
  }

  getLocals() {

    var typeInfo = getTypeInfo(this.props.type);
    var { ctx, options } = this.props;

    var props = typeInfo.innerType.meta.props;
    var order = options.order || Object.keys(props);
    var auto = options.auto || ctx.auto;
    var i18n =  options.i18n || ctx.i18n;
    var label = options.label;
    if (!label && auto === 'labels' && ctx.label) {
      label = ctx.label + (typeInfo.isMaybe ? i18n.optional : '');
    }
    var value = this.state.value || {};
    console.log(value);
    var templates = merge(ctx.templates, options.templates);

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
            auto:       auto,
            label:      humanize(prop),
            i18n:       i18n,
            templates:  templates
          }
        });
      }
    }

    return {
      order,
      label,
      inputs,
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

    t.assert(t.Type.is(type), `[${SOURCE}] missing required prop type`);
    t.assert(t.Obj.is(options), `[${SOURCE}] prop options must be an object`);

    var Component = getComponent(type, options);

    return React.createElement(Component, {
      ref: 'input',
      type: type,
      options: options,
      value: this.props.value,
      onChange: this.props.onChange || noop,
      ctx: {
        auto: 'labels',
        templates: Form.templates,
        i18n: Form.i18n
      }
    });
  }

}

module.exports = {
  Form
};