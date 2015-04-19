// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toExponential
    var numObj = 77.1234;
    
    console.log(numObj.toExponential());  // logs 7.71234e+1
    console.log(numObj.toExponential(4)); // logs 7.7123e+1
    console.log(numObj.toExponential(2)); // logs 7.71e+1
    console.log(77.1234.toExponential()); // logs 7.71234e+1
    console.log(77 .toExponential());     // logs 7.7e+1
})();