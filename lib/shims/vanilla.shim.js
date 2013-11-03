define(

  [
    './jquery.shim'
  ],

  function(jQueryShim) {

    var i = 0;
    var eventHandlers = {};

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

    function cache(element, eventName, callback) {
      eventHandlers[element] = eventHandlers[element] || {};
      eventHandlers[element][eventName] = eventHandlers[element][eventName] || {};

      var guid = eventHandlers[element][eventName].length;

      var wrappedCallback = function(e) {
        callback(e, e.data);
      };

      wrappedCallback.guid = callback.guid || guid;
      callback.guid = wrappedCallback.guid;

      eventHandlers[element][eventName][callback.guid] = wrappedCallback;

      return wrappedCallback;
    }

    function on(element, eventName, callback) {
      var wrappedCallback = cache(element, eventName, callback);

      wrap(element).forEach(function(el) {
        el.addEventListener(eventName, wrappedCallback, false);
      });
    }

    function off(element, eventName, callback) {
      wrap(element).forEach(function(el) {
        var elementHandlers = eventHandlers[element] || {};
        var elementEventHandlers = elementHandlers[eventName] || {};
        if (callback) {
          var handler = elementEventHandlers[callback.guid];
          el.removeEventListener(eventName, handler, false);
        } else {
          var handlers = eventName ? elementEventHandlers : elementHandlers;
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
      return toArray(jQueryShim.closest(element, selector));
    }

    return {
      closest: closest,
      event: createEvent,
      extend: jQueryShim.extend,
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
