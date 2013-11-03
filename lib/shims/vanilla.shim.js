define(

  [
    './jquery.shim'
  ],

  function(jQueryShim) {

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
      wrap(element).forEach(function(el) {
        el.addEventListener(eventName, function(ev) {
          callback(ev, ev.data);
        }, false);
      });
    }

    function off(element, eventName, callback) {
      wrap(element).forEach(function(el) {
        el.removeEventListener(eventName, callback, false);
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
      return jQueryShim.closest(element, selector)[0];
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
