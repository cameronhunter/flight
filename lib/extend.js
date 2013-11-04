define(

  [],

  function() {
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

    function extend() {
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

    return extend;
  }
);
