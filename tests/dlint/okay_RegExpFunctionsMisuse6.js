// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
    // 
    // Match "quick brown" followed by "jumps", ignoring characters in between
    // Remember "brown" and "jumps"
    // Ignore case
    var re = /quick\s(brown).+?(jumps)/ig;
    var result = re.exec('The Quick Brown Fox Jumps Over The Lazy Dog');
})();