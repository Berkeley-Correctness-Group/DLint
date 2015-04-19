// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
    var number = 123456.789;
    
    // request a currency format
    console.log(number.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }));
    // → 123.456,79 €
    
    // the Japanese yen doesn't use a minor unit
    console.log(number.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' }))
    // → ￥123,457
    
    // limit to three significant digits
    console.log(number.toLocaleString('en-IN', { maximumSignificantDigits: 3 }));
    // → 1,23,000
})();