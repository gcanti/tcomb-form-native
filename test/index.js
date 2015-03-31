'use strict';

var tape = require('tape');
var t = require('tcomb');

// custom node-jsx using the react-native transformer
require('./node-jsx').install({harmony: true});

var core = require('../lib/core');

tape('Textbox', function (tape) {

  var Textbox = core.Textbox;
  var ctx = {
    auto: 'labels',
    label: 'ctxDefaultLabel',
    templates: {}
  };

  tape.test('label', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {},
        ctx: ctx
      }).getLocals().label,
      'ctxDefaultLabel',
      'should have a default label');

    tape.strictEqual(
      new Textbox({
        type: t.Str,
        options: {label: 'mylabel'},
        ctx: ctx
      }).getLocals().label,
      'mylabel',
      'should handle label option');

  });

});
