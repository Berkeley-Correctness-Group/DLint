// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
    var date = new Date(Date.UTC(2012, 11, 12, 3, 0, 0));
    
    // toLocaleTimeString() without arguments depends on the implementation,
    // the default locale, and the default time zone
    console.log(date.toLocaleTimeString());
    // → "7:00:00 PM" if run in en-US locale with time zone America/Los_Angeles
})();