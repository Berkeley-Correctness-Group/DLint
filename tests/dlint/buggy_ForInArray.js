// Author: Michael Pradel (michael@binaervarianz.de)

(function() {
    
    // from "Effective JS" book (p. 132)
    var scores= [ 98, 21, 42];
    var total = 0;
    for (var score in scores) {
        total += score;
    }
    var mean = total / scores.length;
    console.log(mean);
    
})();