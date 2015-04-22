// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable
    var a = ['is enumerable'];
    
    // a.propertyIsEnumerable(0);          // returns true
    a.propertyIsEnumerable('length');   // returns false
    
    Math.propertyIsEnumerable('random');   // returns false
    // this.propertyIsEnumerable('Math');     // returns false
})();