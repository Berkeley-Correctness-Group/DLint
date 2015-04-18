// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
    var date = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));
    
    // formats below assume the local time zone of the locale;
    // America/Los_Angeles for the US
    
    // US English uses 12-hour time with AM/PM
    console.log(date.toLocaleTimeString('en-US'));
    // → "7:00:00 PM"
    
    // British English uses 24-hour time without AM/PM
    console.log(date.toLocaleTimeString('en-GB'));
    // → "03:00:00"
    
    // Korean uses 12-hour time with AM/PM
    console.log(date.toLocaleTimeString('ko-KR'));
    // → "오후 12:00:00"
    
    // Arabic in most Arabic speaking countries uses real Arabic digits
    console.log(date.toLocaleTimeString('ar-EG'));
    // → "٧:٠٠:٠٠ م"
    
    // when requesting a language that may not be supported, such as
    // Balinese, include a fallback language, in this case Indonesian
    console.log(date.toLocaleTimeString(['ban', 'id']));
    // → "11.00.00"
})();