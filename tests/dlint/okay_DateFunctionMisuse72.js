// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
    var date = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));
    
    // request a weekday along with a long date
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    console.log(date.toLocaleString('de-DE', options));
    // → "Donnerstag, 20. Dezember 2012"
    
    // an application may want to use UTC and make that visible
    options.timeZone = 'UTC';
    options.timeZoneName = 'short';
    console.log(date.toLocaleString('en-US', options));
    // → "Thursday, December 20, 2012, GMT"
    
    // sometimes even the US needs 24-hour time
    console.log(date.toLocaleString('en-US', { hour12: false }));
    // → "12/19/2012, 19:00:00"
})();