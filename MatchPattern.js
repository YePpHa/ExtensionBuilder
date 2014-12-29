var utils = require("./utils");

/**
 * Following the match pattern documented at https://developer.chrome.com/extensions/match_patterns
**/
function MatchPattern(scheme, host, path) {
  this.scheme = scheme;
  this.host = host;
  this.path = path;
}

MatchPattern.fromPattern = function fromPattern(pattern) {
  var match = /^(\*|http|https|ftp|file)\:\/\/(([*][\.\/])?[a-zA-Z0-9\.\-]*([.][a-zA-Z]+)?|localhost)(\/.*)$/.exec(pattern);
  
  return new MatchPattern(match[1], match[2], match[5]);
};

MatchPattern.wrapScript = function wrapScript(script, includes, excludes) {
  function matching(includes, excludes) {
    var url = window.location.href;
    
    for (var i = 0, len = excludes.length; i < len; i++) {
      if (excludes[i].test(url)) {
        return false;
      }
    }
    
    for (var i = 0, len = includes.length; i < len; i++) {
      if (includes[i].test(url)) {
        return true;
      }
    }
    
    return false;
  }
  
  if (typeof script === "function") {
    script = "(" + script + ")();";
  }
  
  return "if ((" + matching + ")(" + JSON.stringify(includes, utils.extendedJSONParser) + ", " + JSON.stringify(excludes, utils.extendedJSONParser) + ")) { " + script + " }";
};

MatchPattern.prototype.scheme2RegExp = function parseScheme() {
  switch (this.scheme) {
    case "*":
      return "http(s)?";
    case "http":
    case "https":
    case "file":
    case "ftp":
      return this.scheme;
    default:
      throw "Unsupported scheme!";
  }
};

MatchPattern.prototype.host2RegExp = function host2RegExp() {
  if (this.scheme === "file") {
    return ""; // There is no host when scheme is file.
  } else if (this.host === "*") {
    return "([a-zA-Z0-9\\.\\-]+([.][a-zA-Z]+)?)|(localhost)";
  } else {
    var host = this.host;
    if (host.indexOf("/") === host.length - 1) {
      host = host.substring(0, host.length - 1);
    }
    var arr = host.split("");
    var regex = "";
    for (var i = 0, len = arr.length; i < len; i++) {
      if (arr[i] === "*" && i > 0) {
        throw "* (Asterix) must be in the start of the host name!";
      } else if (arr[i] === "*" && i === 0 && arr[i].length > 1 && !(arr[i + 1] === "." || arr[i + 1] === "/")) {
        throw "* (Asterix) must be followed by either . (dot) or / (slash)!";
      } else if ((i + 2) <= len && arr[i] === "*" && arr[i + 1] === "." && (arr[i + 2] === "/" || arr[i + 2] === "*")) {
        throw "'*.' must not be followed by '*' or '/'!";
      } else if (arr[i] === "*") {
        regex += ".*";
        if (arr[i + 1] === ".") {
          i++;
        }
      } else {
        regex += utils.escapeRegExpString(arr[i]);
      }
    }
  }
  
  return regex;
};

MathcPattern.prototype.path2RegExp = function path2RegExp() {
  var path = this.path;
  if (path.indexOf("/") === 0) {
    path = path.substring(1);
  }
  path = path.split("");
  
  var regex = "";
  for (var i = 0, len = path.length; i < len; i++) {
    if (path[i] === "*") {
      regex += "(.*?)";
    } else {
      regex += utils.escapeRegExpString(path[i]);
    }
  }
  return regex;
};

MatchPattern.prototype.toRegExp = function toRegExp() {
  var scheme = this.scheme2RegExp();
  var host = this.host2RegExp();
  var path = this.path2RegExp();
  
  return new RegExp("/^" + scheme + "\\:\\/\\/" + host + "\\/" + path);
};

MatchPattern.prototype.toString = function toString() {
  return this.getScheme() + "://" + this.getHost() + this.getPath();
};

MathcPattern.prototype.getScheme = function getHost() {
  return this.scheme.replace(/[\:\/]/g, "");
};

MathcPattern.prototype.getHost = function getHost() {
  return this.host.replace(/[\/]/g, "");
};

MathcPattern.prototype.getPath = function getHost() {
  var path = this.path;
  if (path.substring(0, 1) !== "/") {
    path = "/" + path;
  }
  return path;
};

exports["MatchPattern"] = MatchPattern;