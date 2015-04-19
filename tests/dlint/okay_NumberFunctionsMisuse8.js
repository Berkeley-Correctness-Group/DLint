// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/valueOf
    var numObj = new Number(10);
    console.log(typeof numObj); // object
    
    var num = numObj.valueOf();
    console.log(num);           // 10
    console.log(typeof num);    // number
})();