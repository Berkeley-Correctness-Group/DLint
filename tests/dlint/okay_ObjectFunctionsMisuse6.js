// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
    var o = {}; // Creates a new object
    
    // Example of an object property added with defineProperty with a data property descriptor
    Object.defineProperty(o, 'a', {
      value: 37,
      writable: true,
      enumerable: true,
      configurable: true
    });
    // 'a' property exists in the o object and its value is 37
    
    // Example of an object property added with defineProperty with an accessor property descriptor
    var bValue = 38;
    Object.defineProperty(o, 'b', {
      get: function() { return bValue; },
      set: function(newValue) { bValue = newValue; },
      enumerable: true,
      configurable: true
    });
    o.b; // 38
    // 'b' property exists in the o object and its value is 38
    // The value of o.b is now always identical to bValue, unless o.b is redefined
})();