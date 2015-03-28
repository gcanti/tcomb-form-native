'use strict';

function getOptionsOfEnum(type) {
  var enums = type.meta.map;
  return Object.keys(enums).map(function (k) {
    return {
      value: k,
      label: enums[k]
    };
  });
}

module.exports = getOptionsOfEnum;