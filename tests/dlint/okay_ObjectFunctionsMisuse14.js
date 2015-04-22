// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
    var print = console.log;
    var arr = ['a', 'b', 'c'];
    print(Object.getOwnPropertyNames(arr).sort()); // prints '0,1,2,length'
    
    // Array-like object
    var obj = { 0: 'a', 1: 'b', 2: 'c' };
    print(Object.getOwnPropertyNames(obj).sort()); // prints '0,1,2'
    
    // Printing property names and values using Array.forEach
    Object.getOwnPropertyNames(obj).forEach(function(val, idx, array) {
      print(val + ' -> ' + obj[val]);
    });
    // prints
    // 0 -> a
    // 1 -> b
    // 2 -> c
    
    // non-enumerable property
    var my_obj = Object.create({}, {
      getFoo: {
        value: function() { return this.foo; },
        enumerable: false
      }
    });
    my_obj.foo = 1;
    
    print(Object.getOwnPropertyNames(my_obj).sort()); // prints 'foo,getFoo'
})();