// Author: Michael Pradel (michael@binaervarianz.de), Liang Gong (gongliang13@cs.berkeley.edu)

/**
 * @dlintShort{Find code that iterates over an array with for .. in.}
 * @dlintLong{It should be avoided because:
 *
 *  * using a normal for-loop is faster
 *  * for .. in includes properties that some library may have added to Array.prototype
 *  * programmers may expect to iterate over the elements instead of the indices}
 * @dlintRule{Avoid for-in loops over arrays, both for efficiency and because it may include properties of \code{Array.prototype}.}
 * @dlintPattern{forIn(val) WHERE isArray(val)}
 * @dlintShortName{ForInArray}
 * @dlintGroup{LanguageMisuse}
 * @dlintNeedDynamic
 * @dlintSingleEventPattern
 */

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;

        var iidToCount = {}; // iid: number --> count: number

        // Array.isArray breaks under cross frame JS code
        // this function is more robust
        function isArray(o) {
            return Object.prototype.toString.call(o) === '[object Array]';
        }

        this.forinObject = function(iid, val) {
            if (isArray(val)) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
            }
        };

        this.endExecution = function() {
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                return new DLintWarning("ForInArray", iid, location, "Iterating over array with for-in at " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);