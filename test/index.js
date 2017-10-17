"use strict";

var test = require("tape");
var t = require("tcomb-validation");
var bootstrap = {
  checkbox: function() {},
  datepicker: function() {},
  select: function() {},
  struct: function() {},
  textbox: function() {},
  list: function() {}
};

var core = require("../lib/components");
import { UIDGenerator } from "../lib/util";

var ctx = {
  auto: "labels",
  label: "ctxDefaultLabel",
  templates: bootstrap,
  i18n: { optional: " (optional)", required: "" },
  uidGenerator: new UIDGenerator("seed"),
  path: []
};
var ctxPlaceholders = {
  auto: "placeholders",
  label: "ctxDefaultLabel",
  templates: bootstrap,
  i18n: { optional: " (optional)", required: "" },
  uidGenerator: new UIDGenerator("seed"),
  path: []
};
var ctxNone = {
  auto: "none",
  label: "ctxDefaultLabel",
  templates: bootstrap,
  i18n: { optional: " (optional)", required: "" },
  uidGenerator: new UIDGenerator("seed"),
  path: []
};

var Textbox = core.Textbox;

test("Textbox:label", function(tape) {
  tape.plan(3);

  tape.strictEqual(
    new Textbox({
      type: t.String,
      options: {},
      ctx: ctx
    }).getLocals().label,
    "ctxDefaultLabel",
    "should have a default label"
  );

  tape.strictEqual(
    new Textbox({
      type: t.String,
      options: { label: "mylabel" },
      ctx: ctx
    }).getLocals().label,
    "mylabel",
    "should handle `label` option"
  );

  tape.strictEqual(
    new Textbox({
      type: t.maybe(t.String),
      options: {},
      ctx: ctx
    }).getLocals().label,
    "ctxDefaultLabel (optional)",
    "should handle optional types"
  );
});

test("Textbox:placeholder", function(tape) {
  tape.plan(6);

  tape.strictEqual(
    new Textbox({
      type: t.String,
      options: {},
      ctx: ctx
    }).getLocals().placeholder,
    undefined,
    "default placeholder should be undefined"
  );

  tape.strictEqual(
    new Textbox({
      type: t.String,
      options: { placeholder: "myplaceholder" },
      ctx: ctx
    }).getLocals().placeholder,
    "myplaceholder",
    "should handle placeholder option"
  );

  tape.strictEqual(
    new Textbox({
      type: t.String,
      options: { label: "mylabel", placeholder: "myplaceholder" },
      ctx: ctx
    }).getLocals().placeholder,
    "myplaceholder",
    "should handle placeholder option even if a label is specified"
  );

  tape.strictEqual(
    new Textbox({
      type: t.String,
      options: {},
      ctx: ctxPlaceholders
    }).getLocals().placeholder,
    "ctxDefaultLabel",
    "should have a default placeholder if auto = placeholders"
  );

  tape.strictEqual(
    new Textbox({
      type: t.maybe(t.String),
      options: {},
      ctx: ctxPlaceholders
    }).getLocals().placeholder,
    "ctxDefaultLabel (optional)",
    "should handle optional types if auto = placeholders"
  );

  tape.strictEqual(
    new Textbox({
      type: t.String,
      options: { placeholder: "myplaceholder" },
      ctx: ctxNone
    }).getLocals().placeholder,
    "myplaceholder",
    "should handle placeholder option even if auto === none"
  );
});

test("Textbox:editable", function(tape) {
  tape.plan(3);

  tape.strictEqual(
    new Textbox({
      type: t.String,
      options: {},
      ctx: ctx
    }).getLocals().editable,
    undefined,
    "default editable should be undefined"
  );

  tape.strictEqual(
    new Textbox({
      type: t.String,
      options: { editable: true },
      ctx: ctx
    }).getLocals().editable,
    true,
    "should handle editable = true"
  );

  tape.strictEqual(
    new Textbox({
      type: t.String,
      options: { editable: false },
      ctx: ctx
    }).getLocals().editable,
    false,
    "should handle editable = false"
  );
});

test("Textbox:help", function(tape) {
  tape.plan(1);

  tape.strictEqual(
    new Textbox({
      type: t.String,
      options: { help: "myhelp" },
      ctx: ctx
    }).getLocals().help,
    "myhelp",
    "should handle help option"
  );
});

test("Textbox:value", function(tape) {
  tape.plan(3);

  tape.strictEqual(
    new Textbox({
      type: t.String,
      options: {},
      ctx: ctx
    }).getLocals().value,
    "",
    "default value should be empty string"
  );

  tape.strictEqual(
    new Textbox({
      type: t.String,
      options: {},
      ctx: ctx,
      value: "a"
    }).getLocals().value,
    "a",
    "should handle value option"
  );

  tape.strictEqual(
    new Textbox({
      type: t.Number,
      options: {},
      ctx: ctx,
      value: 1.1
    }).getLocals().value,
    "1.1",
    "should handle numeric values"
  );
});

test("Textbox:transformer", function(tape) {
  tape.plan(2);

  var transformer = {
    format: function(value) {
      return Array.isArray(value) ? value.join(" ") : value;
    },
    parse: function(value) {
      return value.split(" ");
    }
  };

  tape.strictEqual(
    new Textbox({
      type: t.String,
      options: { transformer: transformer },
      ctx: ctx,
      value: ["a", "b"]
    }).getLocals().value,
    "a b",
    "should handle transformer option (format)"
  );

  tape.deepEqual(
    new Textbox({
      type: t.String,
      options: { transformer: transformer },
      ctx: ctx,
      value: ["a", "b"]
    }).pureValidate().value,
    ["a", "b"],
    "should handle transformer option (parse)"
  );
});

test("Textbox:hasError", function(tape) {
  tape.plan(4);

  tape.strictEqual(
    new Textbox({
      type: t.String,
      options: {},
      ctx: ctx
    }).getLocals().hasError,
    false,
    "default hasError should be false"
  );

  tape.strictEqual(
    new Textbox({
      type: t.String,
      options: { hasError: true },
      ctx: ctx
    }).getLocals().hasError,
    true,
    "should handle hasError option"
  );

  var textbox = new Textbox({
    type: t.String,
    options: {},
    ctx: ctx
  });

  textbox.pureValidate();

  tape.strictEqual(
    textbox.getLocals().hasError,
    false,
    "after a validation error hasError should be true"
  );

  textbox = new Textbox({
    type: t.String,
    options: {},
    ctx: ctx,
    value: "a"
  });

  textbox.pureValidate();

  tape.strictEqual(
    textbox.getLocals().hasError,
    false,
    "after a validation success hasError should be false"
  );
});

test("Textbox:error", function(tape) {
  tape.plan(3);

  tape.strictEqual(
    new Textbox({
      type: t.String,
      options: {},
      ctx: ctx
    }).getLocals().error,
    undefined,
    "default error should be undefined"
  );

  tape.strictEqual(
    new Textbox({
      type: t.String,
      options: { error: "myerror", hasError: true },
      ctx: ctx
    }).getLocals().error,
    "myerror",
    "should handle error option"
  );

  tape.strictEqual(
    new Textbox({
      type: t.String,
      options: {
        error: function(value) {
          return "error: " + value;
        },
        hasError: true
      },
      ctx: ctx,
      value: "a"
    }).getLocals().error,
    "error: a",
    "should handle error option as a function"
  );
});

test("Textbox:template", function(tape) {
  tape.plan(2);

  tape.strictEqual(
    new Textbox({
      type: t.String,
      options: {},
      ctx: ctx
    }).getTemplate(),
    bootstrap.textbox,
    "default template should be bootstrap.textbox"
  );

  var template = function() {};

  tape.strictEqual(
    new Textbox({
      type: t.String,
      options: { template: template },
      ctx: ctx
    }).getTemplate(),
    template,
    "should handle template option"
  );
});

var Select = core.Select;
var Country = t.enums({
  IT: "Italy",
  FR: "France",
  US: "United States"
});

test("Select:label", function(tape) {
  tape.plan(3);

  tape.strictEqual(
    new Select({
      type: Country,
      options: {},
      ctx: ctx
    }).getLocals().label,
    "ctxDefaultLabel",
    "should have a default label"
  );

  tape.strictEqual(
    new Select({
      type: Country,
      options: { label: "mylabel" },
      ctx: ctx
    }).getLocals().label,
    "mylabel",
    "should handle `label` option"
  );

  tape.strictEqual(
    new Select({
      type: t.maybe(Country),
      options: {},
      ctx: ctx
    }).getLocals().label,
    "ctxDefaultLabel (optional)",
    "should handle optional types"
  );
});

test("Select:help", function(tape) {
  tape.plan(1);

  tape.strictEqual(
    new Select({
      type: Country,
      options: { help: "myhelp" },
      ctx: ctx
    }).getLocals().help,
    "myhelp",
    "should handle help option"
  );
});

test("Select:value", function(tape) {
  tape.plan(2);

  tape.strictEqual(
    new Select({
      type: Country,
      options: {},
      ctx: ctx
    }).getLocals().value,
    "",
    "default value should be nullOption.value"
  );

  tape.strictEqual(
    new Select({
      type: Country,
      options: {},
      ctx: ctx,
      value: "a"
    }).getLocals().value,
    "a",
    "should handle value option"
  );
});

test("Select:transformer", function(tape) {
  tape.plan(2);

  var transformer = {
    format: function(value) {
      return t.String.is(value) ? value : value === true ? "1" : "0";
    },
    parse: function(value) {
      return value === "1";
    }
  };

  tape.strictEqual(
    new Select({
      type: t.maybe(t.Boolean),
      options: {
        transformer: transformer,
        options: [{ value: "0", text: "No" }, { value: "1", text: "Yes" }]
      },
      ctx: ctx,
      value: true
    }).getLocals().value,
    "1",
    "should handle transformer option (format)"
  );

  tape.deepEqual(
    new Select({
      type: t.maybe(t.Boolean),
      options: {
        transformer: transformer,
        options: [{ value: "0", text: "No" }, { value: "1", text: "Yes" }]
      },
      ctx: ctx,
      value: true
    }).pureValidate().value,
    true,
    "should handle transformer option (parse)"
  );
});

test("Select:hasError", function(tape) {
  tape.plan(4);

  tape.strictEqual(
    new Select({
      type: Country,
      options: {},
      ctx: ctx
    }).getLocals().hasError,
    false,
    "default hasError should be false"
  );

  tape.strictEqual(
    new Select({
      type: Country,
      options: { hasError: true },
      ctx: ctx
    }).getLocals().hasError,
    true,
    "should handle hasError option"
  );

  var select = new Select({
    type: Country,
    options: {},
    ctx: ctx
  });

  select.pureValidate();

  tape.strictEqual(
    select.getLocals().hasError,
    false,
    "after a validation error hasError should be true"
  );

  select = new Select({
    type: Country,
    options: {},
    ctx: ctx,
    value: "IT"
  });

  select.pureValidate();

  tape.strictEqual(
    select.getLocals().hasError,
    false,
    "after a validation success hasError should be false"
  );
});

test("Select:error", function(tape) {
  tape.plan(3);

  tape.strictEqual(
    new Select({
      type: Country,
      options: {},
      ctx: ctx
    }).getLocals().error,
    undefined,
    "default error should be undefined"
  );

  tape.strictEqual(
    new Select({
      type: Country,
      options: { error: "myerror", hasError: true },
      ctx: ctx
    }).getLocals().error,
    "myerror",
    "should handle error option"
  );

  tape.strictEqual(
    new Select({
      type: Country,
      options: {
        error: function(value) {
          return "error: " + value;
        },
        hasError: true
      },
      ctx: ctx,
      value: "a"
    }).getLocals().error,
    "error: a",
    "should handle error option as a function"
  );
});

test("Select:template", function(tape) {
  tape.plan(2);

  tape.strictEqual(
    new Select({
      type: Country,
      options: {},
      ctx: ctx
    }).getTemplate(),
    bootstrap.select,
    "default template should be bootstrap.select"
  );

  var template = function() {};

  tape.strictEqual(
    new Select({
      type: Country,
      options: { template: template },
      ctx: ctx
    }).getTemplate(),
    template,
    "should handle template option"
  );
});

test("Select:options", function(tape) {
  tape.plan(1);

  tape.deepEqual(
    new Select({
      type: Country,
      options: {
        options: [
          { value: "IT", text: "Italia" },
          { value: "US", text: "Stati Uniti" }
        ]
      },
      ctx: ctx
    }).getLocals().options,
    [
      { text: "-", value: "" },
      { text: "Italia", value: "IT" },
      { text: "Stati Uniti", value: "US" }
    ],
    "should handle options option"
  );
});

test("Select:order", function(tape) {
  tape.plan(2);

  tape.deepEqual(
    new Select({
      type: Country,
      options: { order: "asc" },
      ctx: ctx
    }).getLocals().options,
    [
      { text: "-", value: "" },
      { text: "France", value: "FR" },
      { text: "Italy", value: "IT" },
      { text: "United States", value: "US" }
    ],
    "should handle order = asc option"
  );

  tape.deepEqual(
    new Select({
      type: Country,
      options: { order: "desc" },
      ctx: ctx
    }).getLocals().options,
    [
      { text: "-", value: "" },
      { text: "United States", value: "US" },
      { text: "Italy", value: "IT" },
      { text: "France", value: "FR" }
    ],
    "should handle order = desc option"
  );
});

test("Select:nullOption", function(tape) {
  tape.plan(2);

  tape.deepEqual(
    new Select({
      type: Country,
      options: {
        nullOption: { value: "", text: "Select a country" }
      },
      ctx: ctx
    }).getLocals().options,
    [
      { value: "", text: "Select a country" },
      { text: "Italy", value: "IT" },
      { text: "France", value: "FR" },
      { text: "United States", value: "US" }
    ],
    "should handle nullOption option"
  );

  tape.deepEqual(
    new Select({
      type: Country,
      options: {
        nullOption: false
      },
      ctx: ctx,
      value: "US"
    }).getLocals().options,
    [
      { text: "Italy", value: "IT" },
      { text: "France", value: "FR" },
      { text: "United States", value: "US" }
    ],
    "should skip the nullOption if nullOption = false"
  );
});

var Checkbox = core.Checkbox;

test("Checkbox:label", function(tape) {
  tape.plan(3);

  tape.strictEqual(
    new Checkbox({
      type: t.Boolean,
      options: {},
      ctx: ctx
    }).getLocals().label,
    "ctxDefaultLabel",
    "should have a default label"
  );

  tape.strictEqual(
    new Checkbox({
      type: t.Boolean,
      options: { label: "mylabel" },
      ctx: ctx
    }).getLocals().label,
    "mylabel",
    "should handle `label` option"
  );

  tape.strictEqual(
    new Checkbox({
      type: t.Boolean,
      options: {},
      ctx: ctxNone
    }).getLocals().label,
    null,
    "should have null `label` when auto `none`"
  );
});

test("Checkbox:help", function(tape) {
  tape.plan(1);

  tape.strictEqual(
    new Checkbox({
      type: t.Boolean,
      options: { help: "myhelp" },
      ctx: ctx
    }).getLocals().help,
    "myhelp",
    "should handle help option"
  );
});

test("Checkbox:value", function(tape) {
  tape.plan(2);

  tape.strictEqual(
    new Checkbox({
      type: t.Boolean,
      options: {},
      ctx: ctx
    }).getLocals().value,
    false,
    "default value should be false"
  );

  tape.strictEqual(
    new Checkbox({
      type: t.Boolean,
      options: {},
      ctx: ctx,
      value: true
    }).getLocals().value,
    true,
    "should handle value option"
  );
});

test("Checkbox:transformer", function(tape) {
  tape.plan(2);

  var transformer = {
    format: function(value) {
      return t.String.is(value) ? value : value === true ? "1" : "0";
    },
    parse: function(value) {
      return value === "1";
    }
  };

  tape.strictEqual(
    new Checkbox({
      type: t.Boolean,
      options: { transformer: transformer },
      ctx: ctx,
      value: true
    }).getLocals().value,
    "1",
    "should handle transformer option (format)"
  );

  tape.deepEqual(
    new Checkbox({
      type: t.Boolean,
      options: { transformer: transformer },
      ctx: ctx,
      value: true
    }).pureValidate().value,
    true,
    "should handle transformer option (parse)"
  );
});

test("Checkbox:hasError", function(tape) {
  tape.plan(4);

  var True = t.subtype(t.Boolean, function(value) {
    return value === true;
  });

  tape.strictEqual(
    new Checkbox({
      type: True,
      options: {},
      ctx: ctx
    }).getLocals().hasError,
    false,
    "default hasError should be false"
  );

  tape.strictEqual(
    new Checkbox({
      type: True,
      options: { hasError: true },
      ctx: ctx
    }).getLocals().hasError,
    true,
    "should handle hasError option"
  );

  var checkbox = new Checkbox({
    type: True,
    options: {},
    ctx: ctx
  });

  checkbox.pureValidate();

  tape.strictEqual(
    checkbox.getLocals().hasError,
    false,
    "after a validation error hasError should be true"
  );

  checkbox = new Checkbox({
    type: True,
    options: {},
    ctx: ctx,
    value: true
  });

  checkbox.pureValidate();

  tape.strictEqual(
    checkbox.getLocals().hasError,
    false,
    "after a validation success hasError should be false"
  );
});

test("Checkbox:error", function(tape) {
  tape.plan(3);

  tape.strictEqual(
    new Checkbox({
      type: t.Boolean,
      options: {},
      ctx: ctx
    }).getLocals().error,
    undefined,
    "default error should be undefined"
  );

  tape.strictEqual(
    new Checkbox({
      type: t.Boolean,
      options: { error: "myerror", hasError: true },
      ctx: ctx
    }).getLocals().error,
    "myerror",
    "should handle error option"
  );

  tape.strictEqual(
    new Checkbox({
      type: t.Boolean,
      options: {
        error: function(value) {
          return "error: " + value;
        },
        hasError: true
      },
      ctx: ctx,
      value: "a"
    }).getLocals().error,
    "error: a",
    "should handle error option as a function"
  );
});

test("Checkbox:template", function(tape) {
  tape.plan(2);

  tape.strictEqual(
    new Checkbox({
      type: t.Boolean,
      options: {},
      ctx: ctx
    }).getTemplate(),
    bootstrap.checkbox,
    "default template should be bootstrap.checkbox"
  );

  var template = function() {};

  tape.strictEqual(
    new Checkbox({
      type: t.Boolean,
      options: { template: template },
      ctx: ctx
    }).getTemplate(),
    template,
    "should handle template option"
  );
});

var DatePicker = core.DatePicker;
var date = new Date(1973, 10, 30);

test("DatePicker:label", function(tape) {
  tape.plan(2);

  tape.strictEqual(
    new DatePicker({
      type: t.Date,
      options: {},
      ctx: ctx,
      value: date
    }).getLocals().label,
    "ctxDefaultLabel",
    "should have a default label"
  );

  tape.strictEqual(
    new DatePicker({
      type: t.Date,
      options: { label: "mylabel" },
      ctx: ctx,
      value: date
    }).getLocals().label,
    "mylabel",
    "should handle `label` option"
  );
});

test("DatePicker:help", function(tape) {
  tape.plan(1);

  tape.strictEqual(
    new DatePicker({
      type: t.Date,
      options: { help: "myhelp" },
      ctx: ctx,
      value: date
    }).getLocals().help,
    "myhelp",
    "should handle help option"
  );
});

test("DatePicker:value", function(tape) {
  tape.plan(1);

  tape.strictEqual(
    new DatePicker({
      type: t.Date,
      options: {},
      ctx: ctx,
      value: date
    }).getLocals().value,
    date,
    "should handle value option"
  );
});

test("DatePicker:transformer", function(tape) {
  tape.plan(2);

  var transformer = {
    format: function(value) {
      return Array.isArray(value)
        ? value
        : [value.getFullYear(), value.getMonth(), value.getDate()];
    },
    parse: function(value) {
      return new Date(value[0], value[1], value[2]);
    }
  };

  tape.deepEqual(
    new DatePicker({
      type: t.String,
      options: { transformer: transformer },
      ctx: ctx,
      value: date
    }).getLocals().value,
    [1973, 10, 30],
    "should handle transformer option (format)"
  );

  tape.deepEqual(
    transformer.format(
      new DatePicker({
        type: t.Date,
        options: { transformer: transformer },
        ctx: ctx,
        value: [1973, 10, 30]
      }).pureValidate().value
    ),
    [1973, 10, 30],
    "should handle transformer option (parse)"
  );
});

test("DatePicker:hasError", function(tape) {
  tape.plan(4);

  tape.strictEqual(
    new DatePicker({
      type: t.Date,
      options: {},
      ctx: ctx,
      value: date
    }).getLocals().hasError,
    false,
    "default hasError should be false"
  );

  tape.strictEqual(
    new DatePicker({
      type: t.Date,
      options: { hasError: true },
      ctx: ctx,
      value: date
    }).getLocals().hasError,
    true,
    "should handle hasError option"
  );

  var datePicker = new DatePicker({
    type: t.Date,
    options: {},
    ctx: ctx,
    value: date
  });

  datePicker.pureValidate();

  tape.strictEqual(
    datePicker.getLocals().hasError,
    false,
    "after a validation error hasError should be true"
  );

  datePicker = new DatePicker({
    type: t.Date,
    options: {},
    ctx: ctx,
    value: date
  });

  datePicker.pureValidate();

  tape.strictEqual(
    datePicker.getLocals().hasError,
    false,
    "after a validation success hasError should be false"
  );
});

test("DatePicker:error", function(tape) {
  tape.plan(3);

  tape.strictEqual(
    new DatePicker({
      type: t.Date,
      options: {},
      ctx: ctx,
      value: date
    }).getLocals().error,
    undefined,
    "default error should be undefined"
  );

  tape.strictEqual(
    new DatePicker({
      type: t.Date,
      options: { error: "myerror", hasError: true },
      ctx: ctx,
      value: date
    }).getLocals().error,
    "myerror",
    "should handle error option"
  );

  tape.strictEqual(
    new DatePicker({
      type: t.Date,
      options: {
        error: function(value) {
          return "error: " + value.getFullYear();
        },
        hasError: true
      },
      ctx: ctx,
      value: date
    }).getLocals().error,
    "error: 1973",
    "should handle error option as a function"
  );
});

test("DatePicker:template", function(tape) {
  tape.plan(2);

  tape.strictEqual(
    new DatePicker({
      type: t.Date,
      options: {},
      ctx: ctx,
      value: date
    }).getTemplate(),
    bootstrap.datepicker,
    "default template should be bootstrap.datepicker"
  );

  var template = function() {};

  tape.strictEqual(
    new DatePicker({
      type: t.Date,
      options: { template: template },
      ctx: ctx,
      value: date
    }).getTemplate(),
    template,
    "should handle template option"
  );
});

var List = core.List;

test("List:should support unions", assert => {
  assert.plan(2);

  const AccountType = t.enums.of(["type 1", "type 2", "other"], "AccountType");

  const KnownAccount = t.struct(
    {
      type: AccountType
    },
    "KnownAccount"
  );

  const UnknownAccount = KnownAccount.extend(
    {
      label: t.String
    },
    "UnknownAccount"
  );

  const Account = t.union([KnownAccount, UnknownAccount], "Account");

  Account.dispatch = value =>
    value && value.type === "other" ? UnknownAccount : KnownAccount;

  let component = new List({
    type: t.list(Account),
    ctx: ctx,
    options: {},
    value: [{ type: "type 1" }]
  });

  assert.strictEqual(component.getItems()[0].input.props.type, KnownAccount);

  component = new List({
    type: t.list(Account),
    ctx: ctx,
    options: {},
    value: [{ type: "other" }]
  });

  assert.strictEqual(component.getItems()[0].input.props.type, UnknownAccount);
});
