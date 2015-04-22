// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
    var obj = {
      prop: function() {},
      foo: 'bar'
    };
    
    // New properties may be added, existing properties may be changed or removed
    obj.foo = 'baz';
    obj.lumpy = 'woof';
    delete obj.prop;
    
    var o = Object.freeze(obj);
    
    console.log(Object.isFrozen(obj) === true);
})();