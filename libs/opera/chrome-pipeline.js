(function(){
  var pipeline = {{ require | ./libs/vendor/pipeline.js }};
  
  function handleListener(e) {
    e = e || window.event;
    pipeline.dispatchEvent(e);
  }
  
  function handleMethod(e, detail) {
    e.preventDefault();
    
    opera.extension.postMessage(JSON.stringify(detail));
  }
  
  function init() {
    opera.extension.onmessage = handleListener;
  }
  
  function unload() {
    opera.extension.onmessage = null;
  }
  
  pipeline.subscribe("init", init);
  pipeline.subscribe("unload", unload);
  pipeline.subscribe("method", handleMethod);

  pipeline.init("EBNJS-chrome-pipeline", "EBNJS-page-pipeline");
}).call(this);