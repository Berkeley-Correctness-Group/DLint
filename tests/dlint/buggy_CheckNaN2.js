// Author: Michael Pradel (michael@binaervarianz.de)

(function() {

    function same(p) {
        return p;
    }

    var x = 23 - undefined;
    var y = x + 1;
    var z = y + x;

    same(z);

})();