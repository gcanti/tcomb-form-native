import React from 'react';
import t from 'tcomb-validation';
import {
  humanize,
  merge,
  getTypeInfo,
  getOptionsOfEnum,
  move,
  UIDGenerator,
  getTypeFromUnion,
  getComponentOptions
} from './util';

const SOURCE = 'tcomb-form-native';
const nooptions = Object.freeze({});
const noop = function () {};
const noobj = Object.freeze({});
const noarr = Object.freeze([]);
const Nil = t.Nil;

function getFormComponent(type, options) {
  if (options.factory) {
    return options.factory;
  }
  if (type.getTcombFormFactory) {
    return type.getTcombFormFactory(options);
  }
  const name = t.getTypeName(type);
  switch (type.meta.kind) {
    case 'irreducible' :
      return (
        type === t.Boolean ? Checkbox :
        type === t.Date ?  DatePicker :
                          Textbox
      );
    case 'struct' :
      return Struct;
    case 'list' :
      return List;
    case 'enums' :
      return Select;
    case 'maybe' :
    case 'subtype' :
      return getFormComponent(type.meta.type, options);
    default :
      t.fail(`[${SOURCE}] unsupported type ${name}`);
  }
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
    return this.props.options.transformer || this.constructor.transformer;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const should = (
      nextState.value !== this.state.value ||
      nextState.hasError !== this.state.hasError ||
      nextProps.options !== this.props.options ||
      nextProps.type !== this.props.type
    );
    return should;
  }

  componentWillReceiveProps(props) {
    if (props.type !== this.props.type) {
      this.typeInfo = getTypeInfo(props.type);
    }
    this.setState({value: this.getTransformer().format(props.value)});
  }

  onChange(value) {
    this.setState({value}, () => this.props.onChange(value, this.props.ctx.path));
  }

  getValidationOptions() {
    return {
      path: this.props.ctx.path,
      context: t.mixin(t.mixin({}, this.props.context || this.props.ctx.context), { options: this.props.options })
    };
  }

  getValue() {
    return this.getTransformer().parse(this.state.value);
  }

  isValueNully() {
    return Nil.is(this.getValue());
  }

  removeErrors() {
    this.setState({hasError: false});
  }

  pureValidate() {
    return t.validate(this.getValue(), this.props.type, this.getValidationOptions());
  }

  validate() {
    const result = this.pureValidate();
    this.setState({hasError: !result.isValid()});
    return result;
  }

  getAuto() {
    return this.props.options.auto || this.props.ctx.auto;
  }

  getI18n() {
    return this.props.options.i18n || this.props.ctx.i18n;
  }

  getDefaultLabel() {
    const ctx = this.props.ctx;
    if (ctx.label) {
      return ctx.label + (this.typeInfo.isMaybe ? this.getI18n().optional : this.getI18n().required);
    }
  }

  getLabel() {
    let label = this.props.options.label || this.props.options.legend;
    if (Nil.is(label) && this.getAuto() === 'labels') {
      label = this.getDefaultLabel();
    }
    return label;
  }

  getError() {
    if (this.hasError()) {
      const error = this.props.options.error || this.typeInfo.getValidationErrorMessage;
      if (t.Function.is(error)) {
        const validationOptions = this.getValidationOptions();
        return error(this.getValue(), validationOptions.path, validationOptions.context);
      }
      return error;
    }
  }

  hasError() {
    return this.props.options.hasError || this.state.hasError;
  }

  getConfig() {
    return merge(this.props.ctx.config, this.props.options.config);
  }

  getStylesheet() {
    return this.props.options.stylesheet || this.props.ctx.stylesheet;
  }

  getLocals() {
    return {
      path: this.props.ctx.path,
      error: this.getError(),
      hasError: this.hasError(),
      label: this.getLabel(),
      onChange: this.onChange.bind(this),
      config: this.getConfig(),
      value: this.state.value,
      hidden: this.props.options.hidden,
      stylesheet: this.getStylesheet()
    };
  }

  render() {
    const locals = this.getLocals();
    // getTemplate is the only required implementation when extending Component
    t.assert(t.Function.is(this.getTemplate), `[${SOURCE}] missing getTemplate method of component ${this.constructor.name}`);
    const template = this.getTemplate();
    return template(locals);
  }

}

Component.transformer = {
  format: value => Nil.is(value) ? null : value,
  parse: value => value
};

function toNull(value) {
  return (t.String.is(value) && value.trim() === '') || Nil.is(value) ? null : value;
}

function parseNumber(value) {
  const n = parseFloat(value);
  const isNumeric = (value - n + 1) >= 0;
  return isNumeric ? n : toNull(value);
}

class Textbox extends Component {

  getTransformer() {
    const options = this.props.options;
    return options.transformer ? options.transformer :
      this.typeInfo.innerType === t.Number ? Textbox.numberTransformer :
      Textbox.transformer;
  }

  getTemplate() {
    return this.props.options.template || this.props.ctx.templates.textbox;
  }

  getPlaceholder() {
    let placeholder = this.props.options.placeholder;
    if (Nil.is(placeholder) && this.getAuto() === 'placeholders') {
      placeholder = this.getDefaultLabel();
    }
    return placeholder;
  }

  getKeyboardType() {
    const keyboardType = this.props.options.keyboardType;
    if (t.Nil.is(keyboardType) && this.typeInfo.innerType === t.Number) {
      return 'numeric';
    }
    return keyboardType;
  }

  getLocals() {
    const locals = super.getLocals();
    locals.placeholder = this.getPlaceholder();
    locals.onChangeNative = this.props.options.onChange;
    locals.keyboardType = this.getKeyboardType();
    locals.underlineColorAndroid = (this.props.options.underlineColorAndroid || 'transparent');

    [
      'help',
      'autoCapitalize',
      'autoCorrect',
      'autoFocus',
      'blurOnSubmit',
      'editable',
      'maxLength',
      'multiline',
      'onBlur',
      'onEndEditing',
      'onFocus',
      'onLayout',
      'onSelectionChange',
      'onSubmitEditing',
      'onContentSizeChange',
      'placeholderTextColor',
      'secureTextEntry',
      'selectTextOnFocus',
      'selectionColor',
      'numberOfLines',
      'clearButtonMode',
      'clearTextOnFocus',
      'enablesReturnKeyAutomatically',
      'keyboardAppearance',
      'onKeyPress',
      'returnKeyType',
      'selectionState'
    ].forEach((name) => locals[name] = this.props.options[name]);

    return locals;
  }

}

Textbox.transformer = {
  format: value => Nil.is(value) ? '' : value,
  parse: toNull
};

Textbox.numberTransformer = {
  format: value => Nil.is(value) ? '' : String(value),
  parse: parseNumber
};

class Checkbox extends Component {

  getTemplate() {
    return this.props.options.template || this.props.ctx.templates.checkbox;
  }

  getLocals() {
    const locals = super.getLocals();
    // checkboxes must always have a label
    locals.label = locals.label || this.getDefaultLabel();

    [
      'help',
      'disabled',
      'onTintColor',
      'thumbTintColor',
      'tintColor'
    ].forEach((name) => locals[name] = this.props.options[name]);

    return locals;
  }

}

Checkbox.transformer = {
  format: value => Nil.is(value) ? false : value,
  parse: value => value
};

class Select extends Component {

  getTransformer() {
    const options = this.props.options;
    if (options.transformer) {
      return options.transformer;
    }
    return Select.transformer(this.getNullOption());
  }

  getTemplate() {
    return this.props.options.template || this.props.ctx.templates.select;
  }

  getNullOption() {
    return this.props.options.nullOption || {value: '', text: '-'};
  }

  getEnum() {
    return this.typeInfo.innerType;
  }

  getOptions() {
    const options = this.props.options;
    const items = options.options ? options.options.slice() : getOptionsOfEnum(this.getEnum());
    if (options.order) {
      items.sort(getComparator(options.order));
    }
    const nullOption = this.getNullOption();
    if (options.nullOption !== false) {
      items.unshift(nullOption);
    }
    return items;
  }

  getLocals() {
    const locals = super.getLocals();
    locals.options = this.getOptions();

    [
      'help',
      'enabled',
      'mode',
      'prompt',
      'itemStyle'
    ].forEach((name) => locals[name] = this.props.options[name]);

    return locals;
  }

}

Select.transformer = (nullOption) => {
  return {
    format: value => Nil.is(value) && nullOption ? nullOption.value : String(value),
    parse: value => nullOption && nullOption.value === value ? null : value
  };
};

class DatePicker extends Component {

  getTemplate() {
    return this.props.options.template || this.props.ctx.templates.datepicker;
  }

  getLocals() {
    const locals = super.getLocals();
    [
      'help',
      'maximumDate',
      'minimumDate',
      'minuteInterval',
      'mode',
      'timeZoneOffsetInMinutes'
    ].forEach((name) => locals[name] = this.props.options[name]);

    return locals;
  }

}

DatePicker.transformer = {
  format: value => Nil.is(value) ? new Date() : value,
  parse: value => value
};

class Struct extends Component {

  isValueNully() {
    return Object.keys(this.refs).every((ref) => this.refs[ref].isValueNully());
  }

  removeErrors() {
    this.setState({hasError: false});
    Object.keys(this.refs).forEach((ref) => this.refs[ref].removeErrors());
  }

  getValue() {
    const value = {};
    for (const ref in this.refs) {
      value[ref] = this.refs[ref].getValue();
    }
    return this.getTransformer().parse(value);
  }

  validate() {
    let value = {};
    let errors = [];
    let hasError = false;
    let result;

    if (this.typeInfo.isMaybe && this.isValueNully()) {
      this.removeErrors();
      return new t.ValidationResult({errors: [], value: null});
    }

    for (const ref in this.refs) {
      if (this.refs.hasOwnProperty(ref)) {
        result = this.refs[ref].validate();
        errors = errors.concat(result.errors);
        value[ref] = result.value;
      }
    }

    if (errors.length === 0) {
      const InnerType = this.typeInfo.innerType;
      value = new InnerType(value);
      if (this.typeInfo.isSubtype && errors.length === 0) {
        result = t.validate(value, this.props.type, this.getValidationOptions());
        hasError = !result.isValid();
        errors = errors.concat(result.errors);
      }
    }

    this.setState({hasError: hasError});
    return new t.ValidationResult({errors, value});
  }

  onChange(fieldName, fieldValue, path) {
    const value = t.mixin({}, this.state.value);
    value[fieldName] = fieldValue;
    this.setState({value}, () => {
      this.props.onChange(value, path);
    });
  }

  getTemplates() {
    return merge(this.props.ctx.templates, this.props.options.templates);
  }

  getTemplate() {
    return this.props.options.template || this.getTemplates().struct;
  }

  getTypeProps() {
    return this.typeInfo.innerType.meta.props;
  }

  getOrder() {
    return this.props.options.order || Object.keys(this.getTypeProps());
  }

  getInputs() {
    const { ctx, options } = this.props;
    const props = this.getTypeProps();
    const auto = this.getAuto();
    const i18n =  this.getI18n();
    const config = this.getConfig();
    const value = this.state.value || {};
    const templates = this.getTemplates();
    const stylesheet = this.getStylesheet();
    const inputs = {};
    for (const prop in props) {
      if (props.hasOwnProperty(prop)) {
        const type = props[prop];
        const propValue = value[prop];
        const propType = getTypeFromUnion(type, propValue);
        const fieldsOptions = options.fields || noobj;
        const propOptions = getComponentOptions(fieldsOptions[prop], noobj, propValue, type);
        inputs[prop] = React.createElement(getFormComponent(propType, propOptions), {
          key: prop,
          ref: prop,
          type: propType,
          options: propOptions,
          value: value[prop],
          onChange: this.onChange.bind(this, prop),
          ctx: {
            context: ctx.context,
            uidGenerator: ctx.uidGenerator,
            auto,
            config,
            label: humanize(prop),
            i18n,
            stylesheet,
            templates,
            path: this.props.ctx.path.concat(prop)
          }
        });
      }
    }
    return inputs;
  }

  getLocals() {
    const templates = this.getTemplates();
    const locals = super.getLocals();
    locals.order = this.getOrder();
    locals.inputs = this.getInputs();
    locals.template = templates.struct;
    return locals;
  }

}

function toSameLength(value, keys, uidGenerator) {
  if (value.length === keys.length) {
    return keys;
  }
  const ret = [];
  for (let i = 0, len = value.length; i < len; i++ ) {
    ret[i] = keys[i] || uidGenerator.next();
  }
  return ret;
}

export class List extends Component {

  constructor(props) {
    super(props);
    this.state.keys = this.state.value.map(() => props.ctx.uidGenerator.next());
  }

  componentWillReceiveProps(props) {
    if (props.type !== this.props.type) {
      this.typeInfo = getTypeInfo(props.type);
    }
    const value = this.getTransformer().format(props.value);
    this.setState({
      value,
      keys: toSameLength(value, this.state.keys, props.ctx.uidGenerator)
    });
  }

  isValueNully() {
    return this.state.value.length === 0;
  }

  removeErrors() {
    this.setState({ hasError: false });
    Object.keys(this.refs).forEach((ref) => this.refs[ref].removeErrors());
  }

  getValue() {
    const value = [];
    for (let i = 0, len = this.state.value.length; i < len; i++ ) {
      if (this.refs.hasOwnProperty(i)) {
        value.push(this.refs[i].getValue());
      }
    }
    return this.getTransformer().parse(value);
  }

  validate() {
    const value = [];
    let errors = [];
    let hasError = false;
    let result;

    if (this.typeInfo.isMaybe && this.isValueNully()) {
      this.removeErrors();
      return new t.ValidationResult({errors: [], value: null});
    }

    for (let i = 0, len = this.state.value.length; i < len; i++ ) {
      result = this.refs[i].validate();
      errors = errors.concat(result.errors);
      value.push(result.value);
    }

    // handle subtype
    if (this.typeInfo.isSubtype && errors.length === 0) {
      result = t.validate(value, this.props.type, this.getValidationOptions());
      hasError = !result.isValid();
      errors = errors.concat(result.errors);
    }

    this.setState({hasError: hasError});
    return new t.ValidationResult({errors: errors, value: value});
  }

  onChange(value, keys, path, kind) {
    const allkeys = toSameLength(value, keys, this.props.ctx.uidGenerator);
    this.setState({ value, keys: allkeys, isPristine: false }, () => {
      this.props.onChange(value, path, kind);
    });
  }

  addItem() {
    const value = this.state.value.concat(undefined);
    const keys = this.state.keys.concat(this.props.ctx.uidGenerator.next());
    this.onChange(value, keys, this.props.ctx.path.concat(value.length - 1), 'add');
  }

  onItemChange(itemIndex, itemValue, path, kind) {
    const value = this.state.value.slice();
    value[itemIndex] = itemValue;
    this.onChange(value, this.state.keys, path, kind);
  }

  removeItem(i) {
    const value = this.state.value.slice();
    value.splice(i, 1);
    const keys = this.state.keys.slice();
    keys.splice(i, 1);
    this.onChange(value, keys, this.props.ctx.path.concat(i), 'remove');
  }

  moveUpItem(i) {
    if (i > 0) {
      this.onChange(
        move(this.state.value.slice(), i, i - 1),
        move(this.state.keys.slice(), i, i - 1),
        this.props.ctx.path.concat(i),
        'moveUp'
      );
    }
  }

  moveDownItem(i) {
    if (i < this.state.value.length - 1) {
      this.onChange(
        move(this.state.value.slice(), i, i + 1),
        move(this.state.keys.slice(), i, i + 1),
        this.props.ctx.path.concat(i),
        'moveDown'
      );
    }
  }

  getTemplates() {
    return merge(this.props.ctx.templates, this.props.options.templates);
  }

  getTemplate() {
    return this.props.options.template || this.getTemplates().list;
  }

  getItems() {
    const { options, ctx } = this.props;
    const auto = this.getAuto();
    const i18n = this.getI18n();
    const config = this.getConfig();
    const stylesheet = this.getStylesheet();
    const templates = this.getTemplates();
    const value = this.state.value;
    return value.map((itemValue, i) => {
      const type = this.typeInfo.innerType.meta.type;
      const itemType = getTypeFromUnion(type, itemValue);
      const itemOptions = getComponentOptions(options.item, noobj, itemValue, type);
      const ItemComponent = getFormComponent(itemType, itemOptions);
      const buttons = [];
      if (!options.disableRemove) {
        buttons.push({
          type: 'remove',
          label: i18n.remove,
          click: this.removeItem.bind(this, i)
        });
      }
      if (!options.disableOrder) {
        buttons.push({
          type: 'move-up',
          label: i18n.up,
          click: this.moveUpItem.bind(this, i)
        },
        {
          type: 'move-down',
          label: i18n.down,
          click: this.moveDownItem.bind(this, i)
        });
      }
      return {
        input: React.createElement(ItemComponent, {
          ref: i,
          type: itemType,
          options: itemOptions,
          value: itemValue,
          onChange: this.onItemChange.bind(this, i),
          ctx: {
            context: ctx.context,
            uidGenerator: ctx.uidGenerator,
            auto,
            config,
            label: ctx.label ? `${ctx.label}[${i + 1}]` : String(i + 1),
            i18n,
            stylesheet,
            templates,
            path: ctx.path.concat(i)
          }
        }),
        key: this.state.keys[i],
        buttons: buttons
      };
    });
  }

  getLocals() {
    const options = this.props.options;
    const i18n = this.getI18n();
    const locals = super.getLocals();
    locals.add = options.disableAdd ? null : {
      type: 'add',
      label: i18n.add,
      click: this.addItem.bind(this)
    };
    locals.items = this.getItems();
    locals.className = options.className;
    return locals;
  }

}

List.transformer = {
  format: value => Nil.is(value) ? noarr : value,
  parse: value => value
};

class Form extends React.Component {

  pureValidate() {
    return this.refs.input.pureValidate();
  }

  validate() {
    return this.refs.input.validate();
  }

  getValue() {
    const result = this.validate();
    return result.isValid() ? result.value : null;
  }

  getComponent(path) {
    path = t.String.is(path) ? path.split('.') : path;
    return path.reduce((input, name) => input.refs[name], this.refs.input);
  }

  getSeed() {
    const rii = this._reactInternalInstance;
    if (rii) {
      if (rii._hostContainerInfo) {
        return rii._hostContainerInfo._idCounter;
      }
      if (rii._nativeContainerInfo) {
        return rii._nativeContainerInfo._idCounter;
      }
      if (rii._rootNodeID) {
        return rii._rootNodeID;
      }
    }
    return '0';
  }

  getUIDGenerator() {
    this.uidGenerator = this.uidGenerator || new UIDGenerator(this.getSeed());
    return this.uidGenerator;
  }

  render() {

    const stylesheet = this.props.stylesheet || Form.stylesheet;
    const templates = this.props.templates || Form.templates;
    const i18n = this.props.i18n || Form.i18n;

    if (process.env.NODE_ENV !== 'production') {
      t.assert(t.isType(this.props.type), `[${SOURCE}] missing required prop type`);
      t.assert(t.maybe(t.Object).is(this.props.options) || t.Function.is(this.props.options) || t.list(t.maybe(t.Object)).is(this.props.options), `[${SOURCE}] prop options, if specified, must be an object, a function returning the options or a list of options for unions`);
      t.assert(t.Object.is(stylesheet), `[${SOURCE}] missing stylesheet config`);
      t.assert(t.Object.is(templates), `[${SOURCE}] missing templates config`);
      t.assert(t.Object.is(i18n), `[${SOURCE}] missing i18n config`);
    }

    const value = this.props.value;
    const type = getTypeFromUnion(this.props.type, value);
    const options = getComponentOptions(this.props.options, noobj, value, this.props.type);

    // this is in the render method because I need this._reactInternalInstance._rootNodeID in React ^0.14.0
    // and this._reactInternalInstance._nativeContainerInfo._idCounter in React ^15.0.0
    const uidGenerator = this.getUIDGenerator();

    return React.createElement(getFormComponent(type, options), {
      ref: 'input',
      type: type,
      options: options,
      value: this.props.value,
      onChange: this.props.onChange || noop,
      ctx: {
        context: this.props.context,
        uidGenerator,
        auto: 'labels',
        stylesheet,
        templates,
        i18n,
        path: []
      }
    });
  }

}

module.exports = {
  getComponent: getFormComponent,
  Component,
  Textbox,
  Checkbox,
  Select,
  DatePicker,
  Struct,
  List: List,
  Form
};
