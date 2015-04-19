// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
    // Shape - superclass
    function Shape() {
      this.x = 0;
      this.y = 0;
    }
    
    // superclass method
    Shape.prototype.move = function(x, y) {
      this.x += x;
      this.y += y;
      console.info('Shape moved.');
    };
    
    // Rectangle - subclass
    function Rectangle() {
      Shape.call(this); // call super constructor.
    }
    
    // subclass extends superclass
    Rectangle.prototype = Object.create(Shape.prototype);
    Rectangle.prototype.constructor = Rectangle;
    
    var rect = new Rectangle();
    
    console.log('Is rect an instance of Rectangle? ' + (rect instanceof Rectangle)); // true
    console.log('Is rect an instance of Shape? ' + (rect instanceof Shape)); // true
    rect.move(1, 1); // Outputs, 'Shape moved.'
})();