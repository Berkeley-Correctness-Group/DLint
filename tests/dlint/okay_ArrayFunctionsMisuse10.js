// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
    var arr = [
      { id: 15 },
      { id: -1 },
      { id: 0 },
      { id: 3 },
      { id: 12.2 },
      { },
      { id: null },
      { id: NaN },
      { id: 'undefined' }
    ];
    
    var invalidEntries = 0;
    
    function filterByID(obj) {
      if ('id' in obj && typeof(obj.id) === 'number' && !isNaN(obj.id)) {
        return true;
      } else {
        invalidEntries++;
        return false;
      }
    }
    
    var arrByID = arr.filter(filterByID);
    
    console.log('Filtered Array\n', arrByID); 
    // [{ id: 15 }, { id: -1 }, { id: 0 }, { id: 3 }, { id: 12.2 }]
    
    console.log('Number of Invalid Entries = ', invalidEntries); 
    // 4
})();