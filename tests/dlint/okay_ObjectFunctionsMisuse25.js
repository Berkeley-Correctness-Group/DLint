// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
    var o = {};
    o.prop = 'exists';
    o.hasOwnProperty('prop');             // returns true
    o.hasOwnProperty('toString');         // returns false
    o.hasOwnProperty('hasOwnProperty');   // returns false
})();