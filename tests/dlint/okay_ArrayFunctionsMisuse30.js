// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
    var myFish = ['angel', 'clown', 'mandarin', 'surgeon'];
    
    // removes 0 elements from index 2, and inserts 'drum'
    var removed = myFish.splice(2, 0, 'drum');
    // myFish is ['angel', 'clown', 'drum', 'mandarin', 'surgeon']
    // removed is [], no elements removed
    
    // removes 1 element from index 3
    removed = myFish.splice(3, 1);
    // myFish is ['angel', 'clown', 'drum', 'surgeon']
    // removed is ['mandarin']
    
    // removes 1 element from index 2, and inserts 'trumpet'
    removed = myFish.splice(2, 1, 'trumpet');
    // myFish is ['angel', 'clown', 'trumpet', 'surgeon']
    // removed is ['drum']
    
    // removes 2 elements from index 0, and inserts 'parrot', 'anemone' and 'blue'
    removed = myFish.splice(0, 2, 'parrot', 'anemone', 'blue');
    // myFish is ['parrot', 'anemone', 'blue', 'trumpet', 'surgeon']
    // removed is ['angel', 'clown']
})();