// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
    // using __proto__
    var obj = {};
    Object.defineProperty(obj, 'key', {
      __proto__: null, // no inherited properties
      value: 'static'  // not enumerable
                       // not configurable
                       // not writable
                       // as defaults
    });
    
    // being explicit
    Object.defineProperty(obj, 'key', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: 'static'
    });
    
    // recycling same object
    function withValue(value) {
      var d = withValue.d || (
        withValue.d = {
          enumerable: false,
          writable: false,
          configurable: false,
          value: null
        }
      );
      d.value = value;
      return d;
    }
    // ... and ...
    Object.defineProperty(obj, 'key', withValue('static'));
    
    // if freeze is available, prevents adding or
    // removing the object prototype properties
    // (value, get, set, enumerable, writable, configurable)  
    (Object.freeze || Object)(Object.prototype);
})();