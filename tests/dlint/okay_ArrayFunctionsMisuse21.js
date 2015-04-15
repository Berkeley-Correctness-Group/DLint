// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/ReduceRight
    var flattened = [[0, 1], [2, 3], [4, 5]].reduceRight(function(a, b) {
        return a.concat(b);
    }, []);
    // flattened is [4, 5, 2, 3, 0, 1]
})();