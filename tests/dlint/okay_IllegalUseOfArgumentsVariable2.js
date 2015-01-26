// Author: Michael Pradel (michael@binaervarianz.de)

(function() {

    function foo() {
        var array = [];
        for (var i = 0; i < arguments.length; i++) {
            array.push(arguments[i]);
        }
        return ["A"].concat(array);
    }

    console.log(foo("B", "C"))  ;


})();