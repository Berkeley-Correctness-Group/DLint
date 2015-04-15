// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
    var map = Array.prototype.map;
    var a = map.call('Hello World', function(x) { return x.charCodeAt(0); });
    // a now equals [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]
})();