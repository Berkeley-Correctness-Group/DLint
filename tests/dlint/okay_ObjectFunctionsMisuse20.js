// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed
    // Objects aren't sealed by default.
    var assert = function (obj) {
      if(obj === true) {
        // assert true
      } else {
        // assert false
      }
    }
    var empty = {};
    assert(Object.isSealed(empty) === false);
    
    // If you make an empty object non-extensible, it is vacuously sealed.
    Object.preventExtensions(empty);
    assert(Object.isSealed(empty) === true);
    
    // The same is not true of a non-empty object, unless its properties are all non-configurable.
    var hasProp = { fee: 'fie foe fum' };
    Object.preventExtensions(hasProp);
    assert(Object.isSealed(hasProp) === false);
    
    // But make them all non-configurable and the object becomes sealed.
    Object.defineProperty(hasProp, 'fee', { configurable: false });
    assert(Object.isSealed(hasProp) === true);
    
    // The easiest way to seal an object, of course, is Object.seal.
    var sealed = {};
    Object.seal(sealed);
    assert(Object.isSealed(sealed) === true);
    
    // A sealed object is, by definition, non-extensible.
    assert(Object.isExtensible(sealed) === false);
    
    // A sealed object might be frozen, but it doesn't have to be.
    assert(Object.isFrozen(sealed) === true); // all properties also non-writable
    
    var s2 = Object.seal({ p: 3 });
    assert(Object.isFrozen(s2) === false); // 'p' is still writable
    
    var s3 = Object.seal({ get p() { return 0; } });
    assert(Object.isFrozen(s3) === true); // only configurability matters for accessor properties
})();