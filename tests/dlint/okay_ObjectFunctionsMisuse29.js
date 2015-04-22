// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable
    var o = {};
    var a = [];
    o.prop = 'is enumerable';
    a[0] = 'is enumerable';
    
    o.propertyIsEnumerable('prop');   // returns true
    // a.propertyIsEnumerable(0);        // returns true
})();