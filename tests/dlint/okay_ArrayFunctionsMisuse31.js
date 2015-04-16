// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    var fruit = ['cherries', 'apples', 'bananas'];
    fruit.sort(); // ['apples', 'bananas', 'cherries']
    
    var scores = [1, 10, 2, 21]; 
    scores.sort(); // [1, 10, 2, 21]
    // Watch out that 10 comes before 2,
    // because '10' comes before '2' in Unicode code point order.
    
    var things = ['word', 'Word', '1 Word', '2 Words'];
    things.sort(); // ['1 Word', '2 Words', 'Word', 'word']
    // In Unicode, numbers come before upper case letters,
    // which come before lower case letters.
})();