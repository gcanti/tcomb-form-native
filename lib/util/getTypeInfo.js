'use strict';

function getTypeInfo(type) {

  var innerType = type;
  var isMaybe = false;
  var isSubtype = false;
  var kind;

  while (true) {
    kind = innerType.meta.kind;
    if (kind === 'maybe') {
      isMaybe = true;
      innerType = innerType.meta.type;
      continue;
    }
    if (kind === 'subtype') {
      isSubtype = true;
      innerType = innerType.meta.type;
      continue;
    }
    break;
  }

  return {
    isMaybe: isMaybe,
    isSubtype: isSubtype,
    innerType: innerType
  };
};

module.exports = getTypeInfo;