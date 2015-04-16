// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    // the array to be sorted
    var list = ['Delta', 'alpha', 'CHARLIE', 'bravo'];
    
    // temporary array holds objects with position and sort-value
    var mapped = list.map(function(el, i) {
      return { index: i, value: el.toLowerCase() };
    })
    
    // sorting the mapped array containing the reduced values
    mapped.sort(function(a, b) {
      return +(a.value > b.value) || +(a.value === b.value) - 1;
    });
    
    // container for the resulting order
    var result = mapped.map(function(el){
      return list[el.index];
    });
})();