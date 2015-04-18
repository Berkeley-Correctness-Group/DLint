// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toTimeString
    var d = new Date(1993, 6, 28, 14, 39, 7);
    
    console.log(d.toString());     // prints Wed Jul 28 1993 14:39:07 GMT-0600 (PDT)
    console.log(d.toTimeString()); // prints 14:39:07 GMT-0600 (PDT)
})();