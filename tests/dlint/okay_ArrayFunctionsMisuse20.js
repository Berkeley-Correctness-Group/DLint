// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/ReduceRight
    var total = [0, 1, 2, 3].reduceRight(function(a, b) {
      return a + b;
    });
    // total == 6
})();