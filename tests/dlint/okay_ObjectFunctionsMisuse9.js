// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
    var o = {};
    Object.defineProperty(o, 'a', {
      get: function() { return 1; },
      configurable: false
    });
})();