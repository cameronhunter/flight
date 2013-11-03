define(

  [],

  function() {

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

    function extend() {

      function type(obj) {
        return ({}).toString.call(obj).match(/\[object ([^\]]+)\]/)[1].toLowerCase();
      }

      function isPlainObject(obj) {
        if (!obj || type(obj) != 'object' || obj.nodeType || obj ==  obj.window) {
          return false;
        }
        var key;
        for (key in obj) {}
        return key === undefined || ({}).hasOwnProperty.call(obj, key);
      }

      var options, name, src, copy, copyIsArray, clone,
          target = arguments[0] || {},
          i = 1,
          length = arguments.length,
          deep = false;

      if (typeof target === 'boolean') {
        deep = target;
        target = arguments[1] || {};
        i = 2;
      }

      if (typeof target != 'object' && !(typeof target == 'function')) {
        target = {};
      }

      if (length === i) {
        target = this;
        --i;
      }

      for (; i < length; i++) {
        if ((options = arguments[i]) != null) {
          for (name in options) {
            src = target[name];
            copy = options[name];

            if (target === copy) continue;

            if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
              if (copyIsArray) {
                copyIsArray = false;
                clone = src && Array.isArray(src) ? src : [];
              } else {
                clone = src && isPlainObject(src) ? src : {};
              }

              target[name] = extend(deep, clone, copy);

            } else if (copy !== undefined) {
              target[name] = copy;
            }
          }
        }
      }

      return target;
    }

    return {
      closest: closest,
      event: createEvent,
      extend: extend,
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
