// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr
    var str = 'abcdefghij';
    
    console.log('(1, 2): '   + str.substr(1, 2));   // '(1, 2): bc'
    console.log('(-3, 2): '  + str.substr(-3, 2));  // '(-3, 2): hi'
    console.log('(-3): '     + str.substr(-3));     // '(-3): hij'
    console.log('(1): '      + str.substr(1));      // '(1): bcdefghij'
    console.log('(-20, 2): ' + str.substr(-20, 2)); // '(-20, 2): ab'
    console.log('(20, 2): '  + str.substr(20, 2));  // '(20, 2): '
})();