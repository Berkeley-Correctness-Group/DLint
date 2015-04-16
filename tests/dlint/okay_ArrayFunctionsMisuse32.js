// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    var numbers = [4, 2, 5, 1, 3];
    numbers.sort(function(a, b) {
      return a - b;
    });
    console.log(numbers);
})();