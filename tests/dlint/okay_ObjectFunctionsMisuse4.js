// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties
    var obj = {};
    Object.defineProperties(obj, {
      "property1": {
        value: true,
        writable: true
      },
      "property2": {
        value: "Hello",
        writable: false
      }
      // etc. etc.
    });
})();