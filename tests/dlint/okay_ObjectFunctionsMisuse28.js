// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf
    function Fee() {
      // ...
    }
    
    function Fi() {
      // ...
    }
    Fi.prototype = new Fee();
    
    function Fo() {
      // ...
    }
    Fo.prototype = new Fi();
    
    function Fum() {
      // ...
    }
    Fum.prototype = new Fo();
    
    var fum = new Fum();
    // ...
    
    if (Fi.prototype.isPrototypeOf(fum)) {
      // do something safe
    }
})();