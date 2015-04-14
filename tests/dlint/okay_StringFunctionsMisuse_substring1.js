// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring
    var anyString = 'Mozilla';
    
    // Displays 'Moz'
    console.log(anyString.substring(0, 3));
    console.log(anyString.substring(3, 0));
    
    // Displays 'lla'
    console.log(anyString.substring(4, 7));
    console.log(anyString.substring(7, 4));
    
    // Displays 'Mozill'
    console.log(anyString.substring(0, 6));
    
    // Displays 'Mozilla'
    console.log(anyString.substring(0, 7));
    console.log(anyString.substring(0, 10));
})();