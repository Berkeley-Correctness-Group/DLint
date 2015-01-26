/*
 * Copyright (c) 2015, University of California, Berkeley and TU Darmstadt
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// Author: Liang Gong (gongliang13@cs.berkeley.edu)

/**
 * @dlintShort{Find equality comparison between two floating point numbers.}
 * @dlintLong{In JavaScript ```0.1 + 0.2``` does not equal to ```0.3``` due to floating point rounding.
 * This checker tries to identify any statement of the form
 * ```javascript
 * val == val2
 * val != val2
 * val === val2
 * val !== val2
 * ```
 * where ```val``` and ```val2``` are both numbers, one of which is a float and their difference
 * is smaller than a threshold.
 * }
 * @dlintRule{Avoid checking the equality of similar floating point numbers, as it may lead to surprises due to rounding.}
 * @dlintPattern{binOp(eqOp,left,right,*) WHERE isFloat(left) AND isFloat(right) AND |left-right| < \epsilon}
 * @dlintShortName{FloatEquality}
 * @dlintGroup{UncommonValue}
 * @dlintNeedDynamic
 * @dlintSingleEventPattern
 */

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;
        var Utils = sandbox.Utils;

        var iidToCount = {}; // iid: number --> count: number
        var iidToInfo = {}; // iid: number --> info: object

        function addDebugInfo(iid, msg) {
            if (!iidToInfo[iid]) {
                iidToInfo[iid] = {};
            }
            iidToInfo[iid][msg] = (iidToInfo[iid][msg] | 0) + 1;
        }

        var ERROR_THRESHOLD = Math.abs(0.3 - 0.1 - 0.2) * 100000;

        function hasPrecisionError(op, left, right) {
            // if is not equality comparison operation
            if (!(op === '==' || op === '!=' || op === '===' || op === '!==')) {
                return false;
            }
            // if left and right are not numbers
            if (!((typeof left) === 'number' && (typeof right) === 'number')) {
                return false;
            }
            // if left is NaN
            if (left !== left) {
                return false;
            }
            // if right is NaN
            if (right !== right) {
                return false;
            }
            // if precision error is not big enough
            if (Math.abs(left - right) > ERROR_THRESHOLD) {
                return false;
            }
            // if equal, no problem
            if (left === right) {
                return false;
            }
            return true;
        }

        this.binary = function(iid, op, left, right, result) {
            if (hasPrecisionError(op, left, right)) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                addDebugInfo(iid, ' left: ' + left + ' | op: ' + op + ' | right:' + right + ' --> ' + result);
            }
        };

        this.endExecution = function() {
            //reorganize iidToInfo
            iidToInfo = Utils.reorganizeDebugInfo(iidToInfo);
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                var ret = new DLintWarning("FloatNumberEqualityComparison", iid, location, "Observed small precision difference between float numbers in euqality comparison operation " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
                ret.debugInfo = iidToInfo[iid];
                return ret;
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);