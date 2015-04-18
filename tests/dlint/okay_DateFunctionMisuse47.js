// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setTime
    var theBigDay = new Date('July 1, 1999');
    var sameAsBigDay = new Date();
    sameAsBigDay.setTime(theBigDay.getTime());
})();