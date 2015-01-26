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

// Author: Koushik Sen (ksen@cs.berkeley.edu), Michael Pradel (michael@binaervarianz.de), Liang Gong (gongliang13@cs.berkeley.edu)

/**
 * @dlintShort{Find operations that result in NaN (not a number).}
 * @dlintLong{To reduce false positives, attempts to check if NaNs propagate to the DOM (optionally, currently disabled).}
 * @dlintRule{Avoid producing \code{NaN} (not a number).}
 * @dlintShortName{NaN}
 * @dlintPattern{unOp(*,val,NaN) WHERE val \neq NaN ORR
 * binOp(*,left,right,NaN) WHERE left \neq NaN AND right \neq NaN ORR
 * call(*,*,args,NaN,*) WHERE NaN \notin args}
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
        var additionalInfo = {
            hasInfo: false,
            addMsg: function(msg) {
                this.hasInfo = true;
                this[msg] = this[msg] | 0 + 1;
            }
        };

        function addDebugInfo(iid, msg) {
            if (!iidToInfo[iid]) {
                iidToInfo[iid] = {};
            }
            iidToInfo[iid][msg] = (iidToInfo[iid][msg] | 0) + 1;
        }

        this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod) {
            var i, len = args.length;
            if (result !== result) {
                for (i = 0; i < len; i++) {
                    if (args[i] !== args[i])
                        return;
                }
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                var argsStr = '';
                try {
                    argsStr = JSON.stringify(args);
                } catch (e) {
                    argsStr = 'cannot show, args contains circular reference';
                }
                addDebugInfo(iid, 'function ' + f.name + ' return NaN | arguments: ' + argsStr);
            }
        };

        /*
        this.getField = function(iid, base, offset, val) {
            if (val !== val) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                addDebugInfo(iid, 'get field: ' + offset + ' from ' + typeof base + ' (' + base.constructor.name + ') obtains NaN');
            }
        };

        this.readPre = function(iid, name, val, isGlobal) {
            if (val !== val) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
            }
        }
        */

        this.binary = function(iid, op, left, right, result) {
            // reduce false positive by checking if the input is NaN
            if (left !== left || right !== right) {
                return;
            }
            if (result !== result) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                addDebugInfo(iid, ' left: ' + left + ' | op: ' + op + ' | right:' + right + ' --> NaN');
            }
        };

        this.unary = function(iid, op, left, result) {
            // reduce false positive by checking if the input is NaN
            if (left !== left) {
                return;
            }
            if (result !== result) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                addDebugInfo(iid, ' unary operand: ' + left + ' | op: ' + op + ' --> NaN');
            }
        };

        //function NaNPropagateToPage(val) {
        //    var str = val + '';
        //    if ((str).indexOf('NaN') < 0) {
        //        return false;
        //    }
        //    if ((str).indexOf('\'NaN\'') >= 0 || (str).indexOf('"NaN"') >= 0) {
        //        return false;
        //    }
        //    if ((str).indexOf('isNaN') >= 0) {
        //        return false;
        //    }
        //    if ((str).indexOf('=NaN;') >= 0) {
        //        return false;
        //    }
        //    return true;
        //}

        /*
        // check if concatenated NaN value propagates to the front end page
        this.putFieldPre = function(iid, base, offset, val) {
            if (typeof val !== 'string' && typeof val !== 'number') {
                return;
            }
            if (base && base.constructor &&
                (base.constructor.name === '' || typeof base.constructor.name === 'undefined')) {
                var str = base.constructor.toString();
                var msg = str + ' | ' + offset + ' (' + (typeof offset) + ') | ' + val + '(' + (typeof val) + ') | loc: ' + iidToLocation(iid) + '\r\n';
                // location object, e.g., location.hash = 'test' -> location.hash is '#test'

                if (str.indexOf('Location') >= 0) {
                    if (NaNPropagateToPage(val)) {
                        additionalInfo.addMsg(msg);
                    }
                    return;
                }
                // HTML DOM elements
                if (Utils.isHTMLElement(base)) {
                    if (NaNPropagateToPage(val)) {
                        additionalInfo.addMsg(msg);
                    }
                    return;
                }
                // CSS objects
                if (Utils.isCSSElement(base)) {
                    if (NaNPropagateToPage(val)) {
                        additionalInfo.addMsg(msg);
                    }
                    return;
                }
            }
        };
        */

        this.endExecution = function() {
            //reorganize iidToInfo
            iidToInfo = Utils.reorganizeDebugInfo(iidToInfo);
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                var ret = new DLintWarning("CheckNaN", iid, location, "Observed NaN at " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
                ret.debugInfo = iidToInfo[iid];
                ret.addInfo = JSON.stringify(additionalInfo);
                return ret;
            });

            sandbox.DLint.addWarnings(warnings); // not in browser environment
            /*
            if (!(((typeof window) !== 'undefined') && ((typeof document) !== 'undefined'))) {
                sandbox.DLint.addWarnings(warnings); // not in browser environment
            } else if (additionalInfo.hasInfo) {
                // in browser, and undefined propagates to front page
                sandbox.DLint.addWarnings(warnings);
            } else {
                sandbox.DLint.addWarnings([]);
            }
            */
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);