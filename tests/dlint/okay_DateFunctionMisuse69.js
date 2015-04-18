// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
    var date = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));
    
    // request a weekday along with a long date
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    console.log(date.toLocaleDateString('de-DE', options));
    // → "Donnerstag, 20. Dezember 2012"
    
    // an application may want to use UTC and make that visible
    options.timeZone = 'UTC';
    options.timeZoneName = 'short';
    console.log(date.toLocaleDateString('en-US', options));
    // → "Thursday, December 20, 2012, GMT"
    
    
})();