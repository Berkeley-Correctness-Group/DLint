/*
 * Copyright (c) 2015, University of California, Berkeley
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


// Author: Liang Gong (gongliang13@cs.berkeley.edu), Michael Pradel (michael@binaervarianz.de)

/**
 * @dlintShort{Finds calls of constructors that wrap a primitive into an Object, such as 'new Number()'.}
 * @dlintLong{Warns only if the wrapped primitive leads to result of a binary operation that
 * is different from what the non-wrapped primitive would yield.}
 * @dlintPattern{cond(val) WHERE isBooleanObj(val) AND val.valueOf() = false}
 * @dlintShortName{WrappedPrimitives}
 * @dlintRule{Beware that all wrapped primitives coerce to \code{true}.}
 * @dlintGroup{APIMisuse}
 * @dlintNeedDynamic
 * @dlintSingleEventPattern
 */

(function(sandbox) {
    function MyAnalysis() {
        var Utils = sandbox.Utils;
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;

        var iidToCount = {}; // iid: number --> count: number
        var iidToInfo = {}; // iid: number --> info: object

        var NumberFct = Number;
        var StringFct = String;
        var BooleanFct = Boolean;

        function addDebugInfo(iid, msg) {
            if (!iidToInfo[iid]) {
                iidToInfo[iid] = {};
            }
            iidToInfo[iid][msg] = (iidToInfo[iid][msg] | 0) + 1;
        }

        this.conditional = function(iid, result) {
            if (result instanceof BooleanFct && result.valueOf() === false) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                addDebugInfo(iid, 'Boolean(false) in conditional @' + iidToLocation(iid));
            }
        };

        function binaryOp(op, left, right) {
            var result;
            switch (op) {
                case "+":
                    result = left + right;
                    break;
                case "-":
                    result = left - right;
                    break;
                case "*":
                    result = left * right;
                    break;
                case "/":
                    result = left / right;
                    break;
                case "%":
                    result = left % right;
                    break;
                case "<<":
                    result = left << right;
                    break;
                case ">>":
                    result = left >> right;
                    break;
                case ">>>":
                    result = left >>> right;
                    break;
                case "<":
                    result = left < right;
                    break;
                case ">":
                    result = left > right;
                    break;
                case "<=":
                    result = left <= right;
                    break;
                case ">=":
                    result = left >= right;
                    break;
                case "==":
                    result = left == right;
                    break;
                case "!=":
                    result = left != right;
                    break;
                case "===":
                    result = left === right;
                    break;
                case "!==":
                    result = left !== right;
                    break;
                case "&":
                    result = left & right;
                    break;
                case "|":
                    result = left | right;
                    break;
                case "^":
                    result = left ^ right;
                    break;
                case "delete":
                    result = delete left[right];
                    break;
                case "instanceof":
                    result = left instanceof right;
                    break;
                case "in":
                    result = left in right;
                    break;
                default:
                    throw new Error(op + " at " + iid + " not found");
                    break;
            }
            return result;
        }

        this.binary = function(iid, op, left, right, result) {
            var left_prim = Utils.toPrimitive(left);
            var right_prim = Utils.toPrimitive(right);
            var prim_res = binaryOp(op, left_prim, right_prim);

            if (prim_res !== result) {
                // if both are NaN, do not report warning, since it will be reported by NaN checker
                if(Utils.ISNAN(prim_res) && Utils.ISNAN(result)) {
                    return ;
                } 
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                var leftConstructorName = Utils.getConstructorName(left);
                var rightConstructorName = Utils.getConstructorName(right);
                addDebugInfo(iid, leftConstructorName + '("' + left + '") ' + op +
                    rightConstructorName + '("' + right + '") in binary operation @' + iidToLocation(iid) + '\r\n' + 'Primversion: ' + left_prim + ' ' + op + ' ' + right_prim + '\r\nPrim result:' + prim_res + '\r\nResult:' + result);
            }
        };

        this.endExecution = function() {
            //reorganize iidToInfo
            iidToInfo = Utils.reorganizeDebugInfo(iidToInfo);
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                var ret = new DLintWarning("ConstructWrappedPrimitive", iid, location,
                    "Using the wrapper for a primitive at " + location + " " +
                    iidToCount[iid] + " time(s).", iidToCount[iid]);
                ret.debugInfo = iidToInfo[iid];
                return ret;
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);