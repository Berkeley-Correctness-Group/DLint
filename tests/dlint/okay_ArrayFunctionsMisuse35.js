// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    var items = ['réservé', 'premier', 'cliché', 'communiqué', 'café', 'adieu'];
    items.sort(function (a, b) {
      return a.localeCompare(b);
    });
    
    // items is ['adieu', 'café', 'cliché', 'communiqué', 'premier', 'réservé']
})();