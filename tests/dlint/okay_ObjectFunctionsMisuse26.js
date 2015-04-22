// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
    var buz = {
      fog: 'stack'
    };
    
    for (var name in buz) {
      if (buz.hasOwnProperty(name)) {
        console.log('this is fog (' + name + ') for sure. Value: ' + buz[name]);
      }
      else {
        console.log(name); // toString or something else
      }
    }
})();