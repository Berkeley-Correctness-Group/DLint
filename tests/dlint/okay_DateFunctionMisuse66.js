// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toJSON
    var jsonDate = (new Date()).toJSON();
    var backToDate = new Date(jsonDate);
    
    console.log('Serialized date object: ' + jsonDate);
})();