// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
    var THRESHOLD = 12;
    var v = [5, 2, 16, 4, 3, 18, 20];
    var res;
    
    res = v.every(function(element, index, array) {
      console.log('element:', element);
      if (element >= THRESHOLD) {
        return false;
      }
    
      return true;
    });
    console.log('res:', res);
    // logs:
    // element: 5
    // element: 2
    // element: 16
    // res: false
    
    res = v.some(function(element, index, array) {
      console.log('element:', element);
      if (element >= THRESHOLD) {
        return true;
      }
    
      return false;
    });
    console.log('res:', res);
    // logs:
    // element: 5
    // element: 2
    // element: 16
    // res: true
})();