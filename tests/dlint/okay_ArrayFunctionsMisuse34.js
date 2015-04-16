// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    var stringArray = ['Blue', 'Humpback', 'Beluga'];
    var numericStringArray = ['80', '9', '700'];
    var numberArray = [40, 1, 5, 200];
    var mixedNumericArray = ['80', '9', '700', 40, 1, 5, 200];
    
    function compareNumbers(a, b) {
      return a - b;
    }
    
    // again, assumes a print function is defined
    console.log('stringArray:', stringArray.join());
    console.log('Sorted:', stringArray.sort());
    
    console.log('numberArray:', numberArray.join());
    console.log('Sorted without a compare function:', numberArray.sort());
    console.log('Sorted with compareNumbers:', numberArray.sort(compareNumbers));
    
    console.log('numericStringArray:', numericStringArray.join());
    console.log('Sorted without a compare function:', numericStringArray.sort());
    console.log('Sorted with compareNumbers:', numericStringArray.sort(compareNumbers));
    
    console.log('mixedNumericArray:', mixedNumericArray.join());
    console.log('Sorted without a compare function:', mixedNumericArray.sort());
    console.log('Sorted with compareNumbers:', mixedNumericArray.sort(compareNumbers));
})();