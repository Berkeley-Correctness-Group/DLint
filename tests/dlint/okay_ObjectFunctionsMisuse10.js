// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
    var o = {};
    
    o.a = 1;
    // is equivalent to:
    Object.defineProperty(o, 'a', {
      value: 1,
      writable: true,
      configurable: true,
      enumerable: true
    });
    
    
    // On the other hand,
    Object.defineProperty(o, 'a', { value: 1 });
    // is equivalent to:
    Object.defineProperty(o, 'a', {
      value: 1,
      writable: false,
      configurable: false,
      enumerable: false
    });
})();