/*
 * Copyright 2014 Samsung Information Systems America, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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