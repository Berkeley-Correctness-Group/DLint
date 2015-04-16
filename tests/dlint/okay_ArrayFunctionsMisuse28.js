// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift
    var vegetables = ['parsnip', 'potato'];
    var moreVegs = ['celery', 'beetroot'];
    
    // Merge the second array into the first one
    // Equivalent to vegetables.push('celery', 'beetroot');
    Array.prototype.push.apply(vegetables, moreVegs);
    
    console.log(vegetables); // ['parsnip', 'potato', 'celery', 'beetroot']
})();