// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
    var fileName = 'my file(2).txt';
    var header = "Content-Disposition: attachment; filename*=UTF-8''" 
                 + encodeRFC5987ValueChars(fileName);
    
    console.log(header); 
    // logs "Content-Disposition: attachment; filename*=UTF-8''my%20file%282%29.txt"
    
    
    function encodeRFC5987ValueChars (str) {
        return encodeURIComponent(str).
            // Note that although RFC3986 reserves "!", RFC5987 does not,
            // so we do not need to escape it
            replace(/['()]/g, escape). // i.e., %27 %28 %29
            replace(/\*/g, '%2A').
                // The following are not required for percent-encoding per RFC5987, 
                // so we can allow for a little better readability over the wire: |`^
                replace(/%(?:7C|60|5E)/g, unescape);
    }
})();