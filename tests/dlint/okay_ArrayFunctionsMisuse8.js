// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
    // Consider:
    ['1', '2', '3'].map(parseInt);
    // While one could expect [1, 2, 3]
    // The actual result is [1, NaN, NaN]
    
    // parseInt is often used with one argument, but takes two.
    // The first is an expression and the second is the radix.
    // To the callback function, Array.prototype.map passes 3 arguments: 
    // the element, the index, the array
    // The third argument is ignored by parseInt, but not the second one,
    // hence the possible confusion. See the blog post for more details
    
    function returnInt(element) {
      return parseInt(element, 10);
    }
    
    ['1', '2', '3'].map(returnInt); // [1, 2, 3]
    // Actual result is an array of numbers (as expected)
    
    // A simpler way to achieve the above, while avoiding the "gotcha":
    ['1', '2', '3'].map(Number); // [1, 2, 3]
})();