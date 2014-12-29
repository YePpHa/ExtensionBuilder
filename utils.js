
function isArray(arr) {
  return Object.prototype.toString.call(arr) === "[object Array]";
}

function escapeRegExpString(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function extendedJSONParser(key, value) {
  if (value instanceof RegExp) {
    return value.toString();
  }
  return value;
}

exports["isArray"] = isArray;
exports["escapeRegExpString"] = escapeRegExpString;
exports["extendedJSONParser"] = extendedJSONParser;