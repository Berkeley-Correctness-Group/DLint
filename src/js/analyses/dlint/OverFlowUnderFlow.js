

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
 * @dlintShort{Find numerical overflows and underflows.}
 * @dlintLong{Looks for arithmetic operations where a finite value results in
 * an infinite value.}
 * @dlintPattern(unOp(*,val,\infty) WHERE val \neq \infty ORR
 * binOp(*,left,right,\infty) WHERE left \neq \infty AND right \neq \infty ORR
 * call(builtin,*,args,\infty,*) WHERE \infty \notin args}
 * @dlintRule{Avoid numeric overflow and underflow.}
 * @dlintShortName{OverflowUnderflow}
 * @dlintGroup{UncommonValue}
 * @dlintNeedDynamic
 * @dlintSingleEventPattern
 */

// check number overflow or underflow
// procedures to add debugInfo to checker
// 1. import utils
// 2. add iidToInfo object
// 3. add addDebugInfo
// 4. call addDebugInfo
// 5. call Utils.reorganizeDebugInfo
// 6.0 var ret = ...
// 6. ret.debugInfo = iidToInfo[iid];
// 7. return ret;

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;
        var Utils = sandbox.Utils; // import utils

        var iidToCount = {};  // iid: number --> count: number
        var iidToInfo = {} // iid: number --> info: object

        function isInfinity(x) {
            if(!(typeof x === 'number')) {
                return false;
            }

            if(x!==x) { // NaN
                return false;
            }

            if(Number.isFinite(x)) {
                return false;
            }

            return true;
        }

        function addDebugInfo(iid, msg) {
            if(!iidToInfo[iid]) {
                iidToInfo[iid] = {};
            }
            iidToInfo[iid][msg] = (iidToInfo[iid][msg] | 0) + 1;
        }

        function isNativeFunction(f) {
            if(f && f.toString().indexOf('[native code]')>=0)
                return true;
            return false;
        }

        this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod) {
            if (isNativeFunction(f) && isInfinity(result)) {
                for(var i=0;i<args.length;i++){
                    if(isInfinity(args[i])) {
                       return ; 
                    }
                }
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                addDebugInfo(iid, 'function ' + f.constructor.name + ' returns ' + result);
            }
        };

        /*
        this.getField = function(iid, base, offset, val) {
            if (isInfinity(val)) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
            }
        };
        */

        this.binary = function(iid, op, left, right, result) {
            if (!(isInfinity(left)) && !(isInfinity(right)) && isInfinity(result)) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                addDebugInfo(iid, ' left: ' + left + ' | op: ' + op + ' | right:' + right + ' --> ' + result);
            }
        };

        this.unary = function(iid, op, left, result) {
            if (!isInfinity(left) && isInfinity(result)) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                addDebugInfo(iid, ' unary opearnd: ' + left + ' | op: ' + op + ' --> ' + result);
            }
        };

        this.endExecution = function() {
            //reorganize iidToInfo
            iidToInfo = Utils.reorganizeDebugInfo(iidToInfo);
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                var ret = new DLintWarning("CheckOverflow", iid, location, "Observed Overflow (underflow) at " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
                ret.debugInfo = iidToInfo[iid];
                return ret;
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);



