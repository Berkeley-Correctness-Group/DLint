// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getSeconds
    var Xmas95 = new Date('December 25, 1995 23:15:30');
    var seconds = Xmas95.getSeconds();
    
    console.log(seconds); // 30
})();