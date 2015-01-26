// Author: Michael Pradel (michael@binaervarianz.de)

(function() {
    
    function foo() {
        return ["A"].concat(arguments);
    }
    
    foo("B", "C");
    
})();