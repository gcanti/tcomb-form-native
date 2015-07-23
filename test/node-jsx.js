var fs = require('fs');
var transformer = require('react-native/packager/transformer.js');
var installed = false;

function install(options) {
  if (installed) {
    return;
  }

  options = options || {};

  require.extensions[options.extension || '.js'] = function(module, filename) {
    var src = fs.readFileSync(filename, {encoding: 'utf8'});
    if (typeof options.additionalTransform === 'function') {
      src = options.additionalTransform(src);
    }
    try {
      src = transformer.transform(src, filename).code;
    } catch (e) {
      throw new Error('Error transforming ' + filename + ' to JSX: ' + e.toString());
    }
    module._compile(src, filename);
  };

  installed = true;
}

module.exports = {
  install: install
};