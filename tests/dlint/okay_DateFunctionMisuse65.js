// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
    var today = new Date('05 October 2011 14:48 UTC');
    
    console.log(today.toISOString()); // Returns 2011-10-05T14:48:00.000Z
})();