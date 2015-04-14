// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring
    // Displays 'illa' the last 4 characters
    var anyString = 'Mozilla';
    var anyString4 = anyString.substring(anyString.length - 4);
    console.log(anyString4);
    
    // Displays 'zilla' the last 5 characters
    var anyString = 'Mozilla';
    var anyString5 = anyString.substring(anyString.length - 5);
    console.log(anyString5);
})();