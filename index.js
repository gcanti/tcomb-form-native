var t = require('./lib');
var templates = require('./lib/templates/bootstrap');
var stylesheet = require('./lib/stylesheets/bootstrap');

t.form.Form.templates = templates;
t.form.Form.stylesheet = stylesheet;
t.form.Form.i18n = {
  optional: ' (optional)',
  required: ''
};

module.exports = t;