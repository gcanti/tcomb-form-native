'use strict';

var t = require('tcomb-validation');

function merge(a, b) {
  return t.mixin(t.mixin({}, a), b, true);
}

module.exports = merge;