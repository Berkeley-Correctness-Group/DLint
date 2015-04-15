// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join
    var a = ['Wind', 'Rain', 'Fire'];
    var myVar1 = a.join();      // assigns 'Wind,Rain,Fire' to myVar1
    var myVar2 = a.join(', ');  // assigns 'Wind, Rain, Fire' to myVar2
    var myVar3 = a.join(' + '); // assigns 'Wind + Rain + Fire' to myVar3
    var myVar4 = a.join('');    // assigns 'WindRainFire' to myVar4
})();