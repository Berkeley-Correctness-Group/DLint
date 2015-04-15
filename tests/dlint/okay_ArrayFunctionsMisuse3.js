// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
    var numbers = [1, 4, 9];
    var roots = numbers.map(Math.sqrt);
    // roots is now [1, 2, 3], numbers is still [1, 4, 9]
})();