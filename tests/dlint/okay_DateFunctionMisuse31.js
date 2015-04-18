// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate
    var theBigDay = new Date(1962, 6, 7); // 1962-07-07
    theBigDay.setDate(24);  // 1962-07-24
    theBigDay.setDate(32);  // 1962-08-01
})();