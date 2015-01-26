// Levenshtein string distance. Code copied from https://github.com/NaturalNode/natural.

((function(sandbox) {

    function levenshteinDistance(source, target, options) {
        options = options || {};
        if (isNaN(options.insertion_cost))
            options.insertion_cost = 1;
        if (isNaN(options.deletion_cost))
            options.deletion_cost = 1;
        if (isNaN(options.substitution_cost))
            options.substitution_cost = 1;

        var sourceLength = source.length;
        var targetLength = target.length;
        var distanceMatrix = [[0]];

        for (var row = 1; row <= sourceLength; row++) {
            distanceMatrix[row] = [];
            distanceMatrix[row][0] = distanceMatrix[row - 1][0] + options.deletion_cost;
        }

        for (var column = 1; column <= targetLength; column++) {
            distanceMatrix[0][column] = distanceMatrix[0][column - 1] + options.insertion_cost;
        }

        for (var row = 1; row <= sourceLength; row++) {
            for (var column = 1; column <= targetLength; column++) {
                var costToInsert = distanceMatrix[row][column - 1] + options.insertion_cost;
                var costToDelete = distanceMatrix[row - 1][column] + options.deletion_cost;

                var sourceElement = source[row - 1];
                var targetElement = target[column - 1];
                var costToSubstitute = distanceMatrix[row - 1][column - 1];
                if (sourceElement !== targetElement) {
                    costToSubstitute = costToSubstitute + options.substitution_cost;
                }
                distanceMatrix[row][column] = Math.min(costToInsert, costToDelete, costToSubstitute);
            }
        }
        return distanceMatrix[sourceLength][targetLength];
    }

    sandbox.levenshtein = levenshteinDistance;

})(J$));

