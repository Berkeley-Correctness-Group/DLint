// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift
    var arr = [1, 2];
    
    arr.unshift(0); // result of call is 3, the new array length
    // arr is [0, 1, 2]
    
    arr.unshift(-2, -1); // = 5
    // arr is [-2, -1, 0, 1, 2]
    
    arr.unshift([-3]);
    // arr is [[-3], -2, -1, 0, 1, 2]
})();