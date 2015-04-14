// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test
    function testinput(re, str){
      var midstring;
      if (re.test(str)) {
        midstring = ' contains ';
      } else {
        midstring = ' does not contain ';
      }
      console.log(str + midstring + re.source);
    }
    testinput(/t/, 'test');
    testinput(/ta/, 'test');
})();