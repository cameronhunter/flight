define(

  [
    './jquery.shim'
  ],

  function(jQueryShim) {

    function toArray(items) {
      return Array.prototype.slice.apply(items);
    };

    function wrap(item) {
      if (item === document) {
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

    function find(element, selector) {
      return toArray(element.querySelectorAll(selector));
    }

    function on(element, eventName, callback) {
      unwrap(element).addEventListener(eventName, callback, false);
    }

    return {
      wrap: wrap,
      unwrap: unwrap,
      isWrapped: isWrapped,
      find: find,
      trigger: jQueryShim.trigger,
      closest: jQueryShim.closest,
      event: jQueryShim.event,
      on: jQueryShim.on,
      off: jQueryShim.off,
      extend: jQueryShim.extend
    };
  }
);
