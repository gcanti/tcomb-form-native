/*

  Detecting the React library to require in your own npm packages.
  https://twitter.com/Rygu/status/582683864818167808
  thanks @RickWong

*/
var React;
try {
  React = require.call(this, 'react');
} catch(e) {
  React = require('react-native');
}
module.exports = React;