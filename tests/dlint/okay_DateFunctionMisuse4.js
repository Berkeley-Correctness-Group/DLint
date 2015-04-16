// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    // to test a function and get back its return
    function printElapsedTime(fTest) {
      var nStartTime = Date.now(),
          vReturn = fTest(),
          nEndTime = Date.now();
    
      console.log('Elapsed time: ' + String(nEndTime - nStartTime) + ' milliseconds');
      return vReturn;
    }
    
    printElapsedTime(function (){});
})();