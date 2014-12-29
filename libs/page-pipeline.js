(function(){
  var pipeline = {{ require | ./libs/vendor/pipeline.js }};
  
  pipeline.init("EBNJS-page-pipeline", "EBNJS-chrome-pipeline");

  var exports = {};
  exports.call = pipeline.createMethodCall;
  

  /* global define:true module:true window: true */
  if (typeof define === 'function' && define['amd']) {
    define(function() { return exports; });
  } else if (typeof module !== 'undefined' && module['exports']) {
    module['exports'] = exports;
  } else if (typeof this !== 'undefined') {
    this['page-pipeline'] = exports;
  }
}).call(this);