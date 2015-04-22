// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
    var o = {};
    Object.defineProperty(o, 'a', { value: 1, enumerable: true });
    Object.defineProperty(o, 'b', { value: 2, enumerable: false });
    Object.defineProperty(o, 'c', { value: 3 }); // enumerable defaults to false
    o.d = 4; // enumerable defaults to true when creating a property by setting it
    
    for (var i in o) {
      console.log(i);
    }
    // logs 'a' and 'd' (in undefined order)
    
    Object.keys(o); // ['a', 'd']
    
    o.propertyIsEnumerable('a'); // true
    o.propertyIsEnumerable('b'); // false
    o.propertyIsEnumerable('c'); // false
})();