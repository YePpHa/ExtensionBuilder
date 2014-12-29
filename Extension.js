
function Extension() {
  this.title = null;
  this.author = null;
  this.version = null;
  this.description = null;
  
  this.domains = [];
  this.includes = [];
  this.excludes = [];
  this.matches = [];
  this.grant = [];
  
  this.metadata = {};
  
}

Extension.prototype.setTitle = function setTitle() {
};

Extension.prototype.build = function build(dest, opt) {
  
};


exports["Extension"] = Extension;