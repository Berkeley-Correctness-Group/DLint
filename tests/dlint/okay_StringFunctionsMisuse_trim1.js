// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
    var orig = '   foo  ';
    console.log(orig.trim()); // 'foo'
    
    // Another example of .trim() removing whitespace from just one side.
    
    var orig = 'foo    ';
    console.log(orig.trim()); // 'foo'
})();