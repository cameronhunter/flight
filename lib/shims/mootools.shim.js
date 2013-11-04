define([], function() {
  return {
    closest: function(element, selector) {
      var matches = $$(selector);
      var cur = $$(element);
      while (cur && !matches.contains(cur)) {
         cur = cur.getParent();
      }
      return cur;
    },
    event: function(name) {
      return new DOMEvent(name);
    },
    find: function(element, selector) {
      return $$(element).getElements(selector);
    },
    isDefaultPrevented: function(event) {
      event.preventDefault();
    },
    isWrapped: function(element) {
      return typeOf(element) == 'element' || typeOf(element) == 'elements';
    },
    off: function(element, eventName, callback) {
      $$(element).removeEvent(eventName, callback);
    },
    on: function(element, eventName, callback) {
      $$(element).addEvent(eventName, callback);
    },
    trigger: function(element, eventName, data) {
      $$(element).fireEvent(eventName, data);
    },
    unwrap: function(element) {
      return element[0];
    },
    wrap: $$
  };
});
