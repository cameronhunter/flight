define(

  [
    '../extend'
  ],

  function(extend) {

    function Cache() {
      this.cache = {};
    }

    Cache.prototype.write = function(element, eventName, callback) {
      var cache = this.read(element, eventName);
      var guid = cache.length;

      var wrappedCallback = function(e) {
        callback(e, e.data);
      };

      wrappedCallback.guid = callback.guid || guid;
      callback.guid = wrappedCallback.guid;

      cache[callback.guid] = wrappedCallback;

      return wrappedCallback;
    };

    Cache.prototype.read = function(element, eventName, guid) {
      var len = arguments.length;
      this.cache[element] = this.cache[element] || {};
      this.cache[element][eventName] = this.cache[element][eventName] || {};

      if (len == 1) {
        return this.cache[element];
      }

      if (len == 2) {
        return this.cache[element][eventName];
      }

      return this.cache[element][eventName][guid];
    };

    var eventHandlers = new Cache;

    function toArray(items) {
      return Array.prototype.slice.apply(items);
    };

    function wrap(item) {
      if (isWrapped(item)) {
        return item;
      } else if (item === document) {
        return [document];
      } else {
        return (typeof item == 'string') ? toArray(document.querySelectorAll(item)) : [item];
      }
    }

    function unwrap(item) {
      return item[0];
    }

    function isWrapped(item) {
      return Array.isArray(item);
    }

    function isDefaultPrevented(event) {
      return event.defaultPrevented;
    }

    function find(element, selector) {
      return wrap(element).reduce(function(result, el) {
        return result.concat(toArray(el.querySelectorAll(selector)));
      }, []);
    }

    function on(element, eventName, callback) {
      var wrappedCallback = eventHandlers.write(element, eventName, callback);

      wrap(element).forEach(function(el) {
        el.addEventListener(eventName, wrappedCallback, false);
      });
    }

    function off(element, eventName, callback) {
      wrap(element).forEach(function(el) {
        if (callback) {
          var handler = eventHandlers.read(element, eventName, callback.guid);
          el.removeEventListener(eventName, handler, false);
        } else {
          var handlers = eventHandlers.read(element)
          Object.keys(handlers).forEach(function(key) {
            el.removeEventListener(eventName, handlers[key], false);
          });
        }
      });
    }

    function trigger(element, event, data) {
      var e = (typeof event == 'string') ? createEvent(event) : event;
      e.data = data;

      wrap(element).forEach(function(el) {
        el.dispatchEvent(e);
      });
    }

    function createEvent(name) {
      var e = document.createEvent('HTMLEvents');
      e.initEvent(name, true, true);
      e.eventName = name;
      return e;
    }

    function closest(element, selector) {
      var parents = [];
      var selector = selector || '*';

      wrap(element).forEach(function(current) {
        while(current && current.parentNode) {
          if (current.nodeType < 11 && current.matchesSelector(selector) && parents.indexOf(current) >= 0) {
            current = parents.push(current);
            break;
          }
        }
      });

      return parents;
    }

    return {
      closest: closest,
      event: createEvent,
      find: find,
      isDefaultPrevented: isDefaultPrevented,
      isWrapped: isWrapped,
      off: off,
      on: on,
      trigger: trigger,
      unwrap: unwrap,
      wrap: wrap
    };
  }
);
