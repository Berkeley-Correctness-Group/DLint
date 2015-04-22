// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
    function ParentClass() {}
    ParentClass.prototype.inheritedMethod = function() {};
    
    function ChildClass() {
      this.prop = 5;
      this.method = function() {};
    }
    ChildClass.prototype = new ParentClass;
    ChildClass.prototype.prototypeMethod = function() {};
    
    console.log(
      Object.getOwnPropertyNames(
        new ChildClass() // ['prop', 'method']
      )
    );
})();