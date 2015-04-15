// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
    var str = '12345';
    [].map.call(str, function(x) {
      return x;
    }).reverse().join(''); 
    
    // Output: '54321'
    // Bonus: use '===' to test if original string was a palindrome
})();