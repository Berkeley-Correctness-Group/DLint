// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
    var o = {};
    o.prop = 'exists';
    
    function changeO() {
      o.newprop = o.prop;
      delete o.prop;
    }
    
    o.hasOwnProperty('prop');   // returns true
    changeO();
    o.hasOwnProperty('prop');   // returns 
})();