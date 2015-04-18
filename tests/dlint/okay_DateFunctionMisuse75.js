// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
    var date = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));
    
    // an application may want to use UTC and make that visible
    var options = { timeZone: 'UTC', timeZoneName: 'short' };
    console.log(date.toLocaleTimeString('en-US', options));
    // → "3:00:00 AM GMT"
    
    // sometimes even the US needs 24-hour time
    console.log(date.toLocaleTimeString('en-US', { hour12: false }));
    // → "19:00:00"
})();