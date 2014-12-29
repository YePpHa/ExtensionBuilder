(function(){
  var support = {{ require | ./libs/vendor/support.js }};
  var eventManager = new {{ require | ./libs/vendor/event-manager.js }};
  var Promise = {{ require | ./node_modules/es6-promise/dist/es6-promise.min.js }}.Promise;
  var Base64 = {{ require | ./libs/vendor/base64.js }};
  
  function init(source, destination) {
    sourceId = source;
    destinationId = destination;
    
    var evt = eventManager.publish("init");
    
    if (support.CustomEvent) {
      window.addEventListener(sourceId, listenerHandler, false);
    } else {
      window.addEventListener("message", listenerHandler, false);
    }
    
    window.addEventListener("unload", unload, false);
  }

  function unload() {
    var evt = eventManager.publish("unload");
    
    if (support.CustomEvent) {
      window.removeEventListener(sourceId, listenerHandler, false);
    } else {
      window.removeEventListener("message", listenerHandler, false);
    }
    window.removeEventListener("unload", unload, false);
  }

  function listenerHandler(e) {
    e = e || window.event;
    if (!e || (!e.data && !e.detail && !e.message)) return;
    
    var detail;
    if (support.CustomEvent) {
      detail = e.detail;
      
      typeof e.stopPropagation === "function" && e.stopPropagation();
    } else {
      detail = e.data || e.message;
    }
    
    if ((typeof detail === "object" || (detail = parseJSON(detail))) && detail.source !== sourceId) {
      if (detail.type === "callback") {
        var evt = eventManager.publish("callback", detail);
        
        if (!evt.defaultPrevented) {
          var uid = detail.uid;
          if (cachedFunctions.length > uid && uid >= 0 && typeof cachedFunctions[uid] === "function") {
            cachedFunctions[uid].apply(this, detail.arguments);
            cachedFunctions[uid] = null;
          }
        }
      } else if (detail.type === "method") {
        var evt = eventManager.publish("method", detail);
        
        if (!evt.defaultPrevented) {
          setTimeout(function(){ handleDetail(detail); }, 0);
        }
      }
    }
  }

  function handleDetail(detail) {
    var method = detail.method;
    
    if (method in exports.functions) {
      var args = Array.prototype.slice.call(arguments, 1);
      if (detail.id) {
        args.unshift(createPipelineCaller(detail.id));
      } else {
        args.unshift(null);
      }
      
      exports.functions[method].apply(this, args);
    }
  }

  function createPipelineCaller(id) {
    if (typeof id === "number" || typeof id === "string") {
      return bind(this, createCallbackCall, id);
    } else {
      console.error("[Pipeline] Wrong type of ID: " + (typeof id) + ", " + id);
    }
  }
  
  function dispatchEvent(detail) {
    var evt = eventManager.publish("event-dispatch", detail);
    if (!evt.defaultPrevented) {
      if (support.CustomEvent) {
        var e = document.createEvent("CustomEvent");
        e.initCustomEvent(destinationId, true, true, JSON.stringify(detail, jsonReplacer));
        document.documentElement.dispatchEvent(e);
      } else {
        window.postMessage(JSON.stringify(detail, jsonReplacer), "*");
      }
    }
  }
  
  // TODO Add an automatic system to handle functions.
  //      Change strings to base64 and functions will be changed to `#xx` or something.
  
  function createMethodCall() {
    var args = Array.prototype.slice.call(arguments, 0);
    return new Promise(function(resolve, reject){
      var uid = cachedFunctions.push(resolve) - 1;
      dispatchEvent({ uid: uid, source: sourceId, arguments: args, type: "method" });
    });
  }
  
  function createCallbackCall(uid) {
    dispatchEvent({ uid: uid, source: sourceId, arguments: Array.prototype.slice.call(arguments, 1), type: "callback" });
  }

  /** UTILS **/
  function parseJSON(str) {
    try {
      return JSON.parse(str, jsonReviver);
    } catch (e) { }
    
    return null;
  }
  
  function jsonReplacer(key, value) {
    if (typeof value === "string") {
      return Base64.fromUTF8(value);
    } else if (typeof value === "function") {
      return "#" + (cachedFunctions.push(value) - 1);
    }
    return value;
  }
  
  function jsonReviver(key, value) {
    if (typeof value === "string") {
      if (value.substring(0, 1) === "#") {
        var uid = parseInt(value.substring(1, value.length));
        return createPipelineCaller(uid);
      } else {
        return Base64.toUTF8(value);
      }
    }
    return value;
  }
  
  function bind(scope, fn) {
    var args = Array.prototype.slice.call(arguments, 2);
    return function(){
      fn.apply(scope, args.concat(Array.prototype.slice.call(arguments, 0)));
    };
  }
  
  var sourceId = null;
  var destinationId = null;
  
  var cachedFunctions = [];
  
  var exports = {};
  exports.init = init;
  exports.unload = unload;
  exports.createMethodCall = createMethodCall;
  exports.createCallbackCall = createCallbackCall;
  exports.subscribe = eventManager.subscribe;
  exports.unsubscribe = eventManager.unsubscribe;
  exports.publish = eventManager.publish;
  exports.functions = {};
  exports.dispatchEvent = listenerHandler;
  
  /* global define:true module:true window: true */
  if (typeof define === 'function' && define['amd']) {
    define(function() { return exports; });
  } else if (typeof module !== 'undefined' && module['exports']) {
    module['exports'] = exports;
  } else if (typeof this !== 'undefined') {
    this['pipeline'] = exports;
  }
}).call(this);