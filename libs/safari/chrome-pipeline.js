(function(){
  var pipeline = {{ require | ./libs/vendor/pipeline.js }};
  
  function handleListener(e) {
    e = e || window.event;
    
    if (e.name === "extension-callback") {
      pipeline.dispatchEvent(e);
    }
  }
  
  function handleMethod(e, detail) {
    e.preventDefault();
    
    safari.self.tab.dispatchMessage("extension-call", JSON.stringify(detail));
  }
  
  function init() {
    safari.self.addEventListener("message", handleListener, false);
  }
  
  function unload() {
    safari.self.removeEventListener("message", handleListener, false);
  }
  
  pipeline.subscribe("init", init);
  pipeline.subscribe("unload", unload);
  pipeline.subscribe("method", handleMethod);

  pipeline.init("EBNJS-chrome-pipeline", "EBNJS-page-pipeline");
}).call(this);