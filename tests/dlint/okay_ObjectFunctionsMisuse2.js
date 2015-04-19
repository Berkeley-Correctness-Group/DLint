// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
    function SuperClass() {}
    function OtherSuperClass() {}
    function mixin(obj1, obj2) {}
    function MyClass() {
      SuperClass.call(this);
      OtherSuperClass.call(this);
    }
    
    MyClass.prototype = Object.create(SuperClass.prototype); // inherit
    mixin(MyClass.prototype, OtherSuperClass.prototype); // mixin
    
    MyClass.prototype.myMethod = function() {
      // do a thing
    };
})();