// Author: Michael Pradel (michael@binaervarianz.de)

/**
 * @dlintShort{Find comparisons of a function with a primitive.}
 * @dlintLong{May be problematic if the developer intended to call the function before comparison.}
 * @dlintRule{Avoid comparing a function with a primitive.}
 * @dlintShortName{FunctionVsPrim}
 * @dlintPattern{binOp(relOrEqOp,left,right,*) WHERE isFct(left) AND isPrim(right) ORR
 * binOp(relOrEqOp,left,right,*) WHERE isPrim(left) AND isFct(right)}
 * @dlintGroup{TypeError}
 * @dlintNeedDynamic
 * @dlintSingleEventPattern
 */
(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;

        var iidToCount = {};
        //var varTypeDB = {};

        /*
        var isReport = true;

        this.putFieldPre = function(iid, base, offset, val) {
            if(base && typeof base[offset] === 'function') {
              if(typeof val === 'boolean')
                isReport = false;
            } else if(base && typeof base[offset] === 'boolean') {
              if(typeof val === 'function')
                isReport = false;
            }
        };

        this.writePre = function(iid, name, val, lhs, isGlobal, isPseudoGlobal) {
            if(typeof lhs === 'function') {
              if(typeof val === 'boolean')
                isReport = false;
            } else if(typeof lhs === 'boolean') {
              if(typeof val === 'function')
                isReport = false;
            }
        };
        */

        this.binary = function(iid, op, left, right, result) {
            //if(!isReport) return ;
            var type1 = typeof left;
            var type2 = typeof right;
            if (op === '==' ||
                  op === '===' ||
                  op === '!==' ||
                  op === '!=' ||
                  op === '<' ||
                  op === '>' ||
                  op === '<=' ||
                  op === '>=') {
                if ((type1 === 'function' && (type2 === 'string' || type2 === 'number' || type2 === 'boolean')) ||
                      (type2 === 'function' && (type1 === 'string' || type1 === 'number' || type1 === 'boolean'))) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                }
            }
        };

        this.endExecution = function() {
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                var details = "Comparing a function with a number or string or boolean at " + location + " " + iidToCount[iid] + " time(s).";
                return new DLintWarning("CompareFunctionWithPrimitives", iid, location, details, iidToCount[iid]);
            });
            /*
            if(isReport) {
              sandbox.DLint.addWarnings(warnings);
            } else {
              sandbox.DLint.addWarnings([]);
            }
            */
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);



