// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toString
    var count = 10;
    
    console.log(count.toString());    // displays '10'
    console.log((17).toString());     // displays '17'
    
    var x = 6;
    
    console.log(x.toString(2));       // displays '110'
    console.log((254).toString(16));  // displays 'fe'
    
    console.log((-10).toString(2));   // displays '-1010'
    console.log((-0xff).toString(2)); // displays '-11111111'
})();