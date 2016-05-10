import t from './lib';
import i18n from './lib/i18n/en';
import templates from './lib/templates/bootstrap';
import stylesheet from './lib/stylesheets/bootstrap';

t.form.Form.templates = templates;
t.form.Form.stylesheet = stylesheet;
t.form.Form.i18n = i18n;

t.form.Form.defaultProps = {
  templates: t.form.Form.templates,
  stylesheet: t.form.Form.stylesheet,
  i18n: t.form.Form.i18n
};

module.exports = t;
