// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop
    var myFish = ['angel', 'clown', 'mandarin', 'sturgeon'];
    
    console.log(myFish); // ['angel', 'clown', 'mandarin', 'sturgeon']
    
    var popped = myFish.pop();
    
    console.log(myFish); // ['angel', 'clown', 'mandarin' ] 
    
    console.log(popped); // 'sturgeon'
})();