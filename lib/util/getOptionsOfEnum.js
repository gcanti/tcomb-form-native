'use strict';

function getOptionsOfEnum(type) {
  var enums = type.meta.map;
  return Object.keys(enums).map(function (k) {
    return {
      value: k,
      text: enums[k]
    };
  });
}

module.exports = getOptionsOfEnum;