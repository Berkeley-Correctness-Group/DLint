// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
    var foo = {
      hasOwnProperty: function(prop) {
        return false;
      },
      bar: 'Here be dragons'
    };
    
    foo.hasOwnProperty('bar'); // always returns false
    
    // Use another Object's hasOwnProperty and call it with 'this' set to foo
    ({}).hasOwnProperty.call(foo, 'bar'); // true
    
    // It's also possible to use the hasOwnProperty property from the Object prototype for this purpose
    Object.prototype.hasOwnProperty.call(foo, 'bar'); // true
})();