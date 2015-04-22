// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable
    var a = [];
    a.propertyIsEnumerable('constructor');         // returns false
    
    function firstConstructor() {
      this.property = 'is not enumerable';
    }
    
    firstConstructor.prototype.firstMethod = function() {};
    
    function secondConstructor() {
      this.method = function method() { return 'is enumerable'; };
    }
    
    secondConstructor.prototype = new firstConstructor;
    secondConstructor.prototype.constructor = secondConstructor;
    
    var o = new secondConstructor();
    o.arbitraryProperty = 'is enumerable';
    
    o.propertyIsEnumerable('arbitraryProperty');   // returns true
    o.propertyIsEnumerable('method');              // returns true
    o.propertyIsEnumerable('property');            // returns false
    
    // o.property = 'is enumerable';
    
    // o.propertyIsEnumerable('property');            // returns true
    
    // These return false as they are on the prototype which 
    // propertyIsEnumerable does not consider (even though the last two
    // are iteratable with for-in)
    o.propertyIsEnumerable('prototype');   // returns false (as of JS 1.8.1/FF3.6)
    o.propertyIsEnumerable('constructor'); // returns false
    o.propertyIsEnumerable('firstMethod'); // returns false
})();