// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible
    // New objects are extensible.
    var assert = function (obj) {
      if(obj === true) {
        // assert true
      } else {
        // assert false
      }
    } 
    
    var empty = {};
    assert(Object.isExtensible(empty) === true);
    
    // ...but that can be changed.
    Object.preventExtensions(empty);
    assert(Object.isExtensible(empty) === false);
    
    // Sealed objects are by definition non-extensible.
    var sealed = Object.seal({});
    assert(Object.isExtensible(sealed) === false);
    
    // Frozen objects are also by definition non-extensible.
    var frozen = Object.freeze({});
    assert(Object.isExtensible(frozen) === false);
})();