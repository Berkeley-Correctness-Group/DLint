// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
    var number = 123456.789;
    
    // German uses comma as decimal separator and period for thousands
    console.log(number.toLocaleString('de-DE'));
    // → 123.456,789
    
    // Arabic in most Arabic speaking countries uses real Arabic digits
    console.log(number.toLocaleString('ar-EG'));
    // → ١٢٣٤٥٦٫٧٨٩
    
    // India uses thousands/lakh/crore separators
    console.log(number.toLocaleString('en-IN'));
    // → 1,23,456.789
    
    // the nu extension key requests a numbering system, e.g. Chinese decimal
    console.log(number.toLocaleString('zh-Hans-CN-u-nu-hanidec'));
    // → 一二三,四五六.七八九
    
    // when requesting a language that may not be supported, such as
    // Balinese, include a fallback language, in this case Indonesian
    console.log(number.toLocaleString(['ban', 'id']));
    // → 123.456,789
})();