(function(){
  var pipeline = {{ require | ./libs/vendor/pipeline.js }};
  
  /** Chrome API **/
  function save(callback, key, data) {
    if (chrome && chrome.storage && chrome.storage.local) {
      var storage = chrome.storage.local;
      var details = {};
      details[key] = JSON.stringify(data);
      storage.set(details);
      
      callback && callback();
    }
  }

  function load(callback, key) {
    if (chrome && chrome.storage && chrome.storage.local) {
      var storage = chrome.storage.local;
      var value = null;
      if ((value = localStorage.getItem(key) || null) !== null) {
        var details = {};
        details[key] = value;
        
        storage.set(details);
        
        localStorage.removeItem(key);
        callback && callback(value);
      } else {
        storage.get(key, function(result) {
          var res = {};
          if (key in result) {
            res = result[key];
          }
          
          callback && callback(res);
        });
      }
    }
  }
  
  function xhr(callback, details) {
    var xmlhttp;
    if (typeof XMLHttpRequest != "undefined") {
      xmlhttp = new XMLHttpRequest();
    } else {
      details["onerror"] && details["onerror"](responseState);
    }
    xmlhttp.onreadystatechange = function(){
      var responseState = {
        responseXML: '',
        responseText: (xmlhttp.readyState == 4 ? xmlhttp.responseText : ''),
        readyState: xmlhttp.readyState,
        responseHeaders: (xmlhttp.readyState == 4 ? xmlhttp.getAllResponseHeaders() : ''),
        status: (xmlhttp.readyState == 4 ? xmlhttp.status : 0),
        statusText: (xmlhttp.readyState == 4 ? xmlhttp.statusText : ''),
        finalUrl: (xmlhttp.readyState == 4 ? xmlhttp.finalUrl : '')
      };
      if (details["onreadystatechange"]) {
        details["onreadystatechange"](responseState);
      }
      if (xmlhttp.readyState == 4) {
        if (details["onload"] && xmlhttp.status >= 200 && xmlhttp.status < 300) {
          details["onload"](responseState);
        }
        if (details["onerror"] && (xmlhttp.status < 200 || xmlhttp.status >= 300)) {
          details["onerror"](responseState);
        }
      }
    };
    try {
      xmlhttp.open(details.method, details.url);
    } catch(e) {
      details["onerror"] && details["onerror"]();
    }
    if (details.headers) {
      for (var prop in details.headers) {
        xmlhttp.setRequestHeader(prop, details.headers[prop]);
      }
    }
    xmlhttp.send((typeof(details.data) !== 'undefined') ? details.data : null);
    callback && callback();
  }

  pipeline.functions.save = save;
  pipeline.functions.load = load;
  pipeline.functions.xhr = xhr;

  pipeline.init("EBNJS-chrome-pipeline", "EBNJS-page-pipeline");
}).call(this);