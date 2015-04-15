// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
    function isBiggerThan10(element, index, array) {
      return element > 10;
    }
    [2, 5, 8, 1, 4].some(isBiggerThan10);  // false
    [12, 5, 8, 1, 4].some(isBiggerThan10); // true
})();