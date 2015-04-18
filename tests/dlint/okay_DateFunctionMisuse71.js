// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
    var date = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));
    
    // formats below assume the local time zone of the locale;
    // America/Los_Angeles for the US
    
    // US English uses month-day-year order and 12-hour time with AM/PM
    console.log(date.toLocaleString('en-US'));
    // → "12/19/2012, 7:00:00 PM"
    
    // British English uses day-month-year order and 24-hour time without AM/PM
    console.log(date.toLocaleString('en-GB'));
    // → "20/12/2012 03:00:00"
    
    // Korean uses year-month-day order and 12-hour time with AM/PM
    console.log(date.toLocaleString('ko-KR'));
    // → "2012. 12. 20. 오후 12:00:00"
    
    // Arabic in most Arabic speaking countries uses real Arabic digits
    console.log(date.toLocaleString('ar-EG'));
    // → "٢٠‏/١٢‏/٢٠١٢ ٥:٠٠:٠٠ ص"
    
    // for Japanese, applications may want to use the Japanese calendar,
    // where 2012 was the year 24 of the Heisei era
    console.log(date.toLocaleString('ja-JP-u-ca-japanese'));
    // → "24/12/20 12:00:00"
    
    // when requesting a language that may not be supported, such as
    // Balinese, include a fallback language, in this case Indonesian
    console.log(date.toLocaleString(['ban', 'id']));
    // → "20/12/2012 11.00.00"
})();