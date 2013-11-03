define(

  [],

  function() {
    var $ = jQuery;

    return {
      /**************************************************************************
       * Core
       **************************************************************************/
      wrap: $,

      unwrap: function(item) {
        return item[0];
      },

      isWrapped: function(item) {
        return item.jquery;
      },

      /**************************************************************************
       * Traversing
       **************************************************************************/
      find: function(element, selector) {
        return $(element).find(selector);
      },

      // Returns an Array
      closest: function(element, selector) {
        return $(element).closest(selector);
      },

      /**************************************************************************
       * Events
       **************************************************************************/
      event: $.Event,

      isDefaultPrevented: function(event) {
        return event.isDefaultPrevented();
      },

      on: function(element, eventName, cb) {
        $(element).on(eventName, cb);
      },

      off: function(element, eventName, cb) {
        $(element).off(eventName, cb);
      },

      trigger: function(element, eventName, data) {
        $(element).trigger(eventName, data)
      },

      /**************************************************************************
       * Utilities
       **************************************************************************/
      extend: $.extend
    };
  }
);
