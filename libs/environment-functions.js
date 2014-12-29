var liquid = new require("Liquid").Liquid();
var fs = require("fs");

liquid.functions.require = function require(path) {
  var content = fs.readFileSync(path, "utf8");
  
  return "(function(){var module={};module[\"exports\"]={};" + content + ";return module[\"exports\"];})()";
}