(function(){
  function EventManager() {
    this.listeners = {};
  }
  EventManager.prototype.subscribe = function subscribe(event, fn) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(fn);
  }
  EventManager.prototype.unsubscribe = function unsubscribe(event, fn) {
    var eventListeners = null;
    if ((eventListeners = this.listeners[event])) {
      for (var i = 0, len = eventListeners.length; i < len; i++) {
        if (eventListeners[i] === fn) {
          eventListeners.splice(i, 1);
          break;
        }
      }
    }
  }
  EventManager.prototype.publish = function publish(event) {
    if (!this.listeners[event]) return;
    var eventListeners = this.listeners[event];
    
    var args = Array.prototype.slice.call(arguments, 1);
    
    var evt = new EventManager.Event(event, false);
    
    for (var i = 0, len = eventListeners.length; i < len; i++) {
      eventListeners[i].apply(this, [evt].concat(args));
    }
    return evt;
  }
  
  EventManager.Event = function Event(type, bubbles) {
    this.bubbles = bubbles;
    this.cancelBubble = false;
    this.cancelable = false;
    this.currentTarget = null;
    this.defaultPrevented = false;
    this.eventPhase = this.NONE;
    this.target = null;
    this.timeStamp = (new Date).getTime();
    this.type = type;
    this.isTrusted = true;
  }
  
  EventManager.Event.prototype.NONE = 0;
  EventManager.Event.prototype.CAPTURING_PHASE = 1;
  EventManager.Event.prototype.AT_TARGET = 2;
  EventManager.Event.prototype.BUBBLING_PHASE = 3;
  
  EventManager.Event.prototype.preventDefault = function preventDefault() {
    this.defaultPrevented = true;
  }
  
  EventManager.Event.prototype.stopImmediatePropagation = function stopImmediatePropagation() {
    throw "Not implemented yet!";
  }
  
  EventManager.Event.prototype.stopPropagation = function stopPropagation() {
    throw "Not implemented yet!";
  }
  
  /* global define:true module:true window: true */
  if (typeof define === 'function' && define['amd']) {
    define(function() { return EventManager; });
  } else if (typeof module !== 'undefined' && module['exports']) {
    module['exports'] = EventManager;
  } else if (typeof this !== 'undefined') {
    this['EventManager'] = EventManager;
  }
}).call(this);