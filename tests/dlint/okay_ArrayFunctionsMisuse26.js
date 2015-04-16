// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toLocaleString
    var number = 1337;
    var date = new Date();
    var myArr = [number, date, 'foo'];
    
    var str = myArr.toLocaleString(); 
    
    console.log(str); 
    // prints '1337,6.12.2013 19:37:35,foo'
    // if run in a German (de-DE) locale with timezone Europe/Berlin
})();