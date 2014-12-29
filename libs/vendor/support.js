(function(){
  function localStorageTest() {
    try {
      localStorage.setItem(mod, mod);
      localStorage.removeItem(mod);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  function customEvent() {
    try {
      var e = document.createEvent("CustomEvent");
      if (e && typeof e.initCustomEvent === "function") {
        e.initCustomEvent(mod, true, true, { mod: mod });
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
  
  function gmCheck() {
    try {
      if (typeof GM_setValue !== "undefined") {
        try {
          if ((typeof GM_setValue.toString === "undefined" || GM_setValue.toString().indexOf("not supported") === -1)) {
            return true;
          } else {
            return false;
          }
        } catch (e) {
          return true;
        }
      }
    } catch (e) {
      return false;
    }
  }
  
  function firefoxCloneInto() {
    try {
      if (typeof cloneInto === "function") {
        return true;
      }
    } catch (e) { }
    return false;
  }
  
  var mod = "support.test";
  
  var exports = {};
  exports.localStorage = localStorageTest();
  exports.Greasemonkey = gmCheck();
  exports.Adguard = (typeof AdguardSettings === "object");
  exports.cloneInto = firefoxCloneInto();
  exports.CustomEvent = customEvent();
  
  /* global define:true module:true window: true */
  if (typeof define === 'function' && define['amd']) {
    define(function() { return exports; });
  } else if (typeof module !== 'undefined' && module['exports']) {
    module['exports'] = exports;
  } else if (typeof this !== 'undefined') {
    this['support'] = exports;
  }
}).call(this);