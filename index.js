var t = require('./lib');
var templates = require('./lib/skins/ios');

t.form.Form.templates = templates;
t.form.Form.i18n = {
  optional: ' (optional)'
};

module.exports = t;