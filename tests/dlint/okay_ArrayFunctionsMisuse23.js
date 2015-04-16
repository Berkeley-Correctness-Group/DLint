// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse
    var myFish = ['angel', 'clown', 'mandarin', 'surgeon'];
    
    console.log('myFish before: ' + myFish);
    
    var shifted = myFish.shift();
    
    console.log('myFish after: ' + myFish);
    console.log('Removed this element: ' + shifted);
})();