// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
    [0, 1, 2, 3, 4].reduce(function(previousValue, currentValue, index, array) {
      return previousValue + currentValue;
    }, 10);
})();