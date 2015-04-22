// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions
    // Object.preventExtensions returns the object being made non-extensible.
    var assert = function (obj) {
      if(obj === true) {
        // assert true
      } else {
        // assert false
      }
    }
    var obj = {};
    var obj2 = Object.preventExtensions(obj);
    assert(obj === obj2);
    
    // Objects are extensible by default.
    var empty = {};
    assert(Object.isExtensible(empty) === true);
    
    // ...but that can be changed.
    Object.preventExtensions(empty);
    assert(Object.isExtensible(empty) === false);
    
    // Object.defineProperty throws when adding a new property to a non-extensible object.
    var nonExtensible = { removable: true };
    Object.preventExtensions(nonExtensible);
    // Object.defineProperty(nonExtensible, 'new', { value: 8675309 }); // throws a TypeError
    
    // In strict mode, attempting to add new properties to a non-extensible object throws a TypeError.
    function fail() {
      'use strict';
      nonExtensible.newProperty = 'FAIL'; // throws a TypeError
    }
    // fail();
    
    // EXTENSION (only works in engines supporting __proto__
    // (which is deprecated. Use Object.getPrototypeOf instead)):
    // A non-extensible object's prototype is immutable.
    var fixed = Object.preventExtensions({});
    // fixed.__proto__ = { oh: 'hai' }; // throws a TypeError
})();