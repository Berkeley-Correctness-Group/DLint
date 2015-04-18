// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
    var date = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));
    
    // formats below assume the local time zone of the locale;
    // America/Los_Angeles for the US
    
    // US English uses month-day-year order
    console.log(date.toLocaleDateString('en-US'));
    // → "12/19/2012"
    
    // British English uses day-month-year order
    console.log(date.toLocaleDateString('en-GB'));
    // → "20/12/2012"
    
    // Korean uses year-month-day order
    console.log(date.toLocaleDateString('ko-KR'));
    // → "2012. 12. 20."
    
    // Arabic in most Arabic speaking countries uses real Arabic digits
    console.log(date.toLocaleDateString('ar-EG'));
    // → "٢٠‏/١٢‏/٢٠١٢"
    
    // for Japanese, applications may want to use the Japanese calendar,
    // where 2012 was the year 24 of the Heisei era
    console.log(date.toLocaleDateString('ja-JP-u-ca-japanese'));
    // → "24/12/20"
    
    // when requesting a language that may not be supported, such as
    // Balinese, include a fallback language, in this case Indonesian
    console.log(date.toLocaleDateString(['ban', 'id']));
    // → "20/12/2012"
})();