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

// Author: Michael Pradel (michael@binaervarianz.de), Liang Gong (gongliang13@cs.berkeley.edu)

/**
 * @dlintShort{Find assignments that overwrite a built-in variable.}
 * @dlintLong{Built-in variables, such as 'arguments' and 'String' should not be
 * overwritten by any JS program.}
 * @dlintCanCheckStatically
 * @dlintObsolete
 */

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;

        var iidToCount = {};  // iid: number --> count: number
        
        // the list mainly comes from the following source:
        // https://jslinterrors.com/read-only
        // MP: a more complete list is here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
        //     .. but I think we should remove this checker because it can be done statically
        var forbNameList = ['arguments', 'undefined', 'Boolean', 'String', 'Array', 'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'Error', 'eval', 'EvalError', 'Function', 'hasOwnProperty', 'Infinity', 'isFinite', 'isNaN', 'JSON', 'Map', 'NaN', 'Number', 'Object', 'parseInt', 'parseFloat', 'Promise', 'RangeError', 'ReferenceError', 'Reflect', 'RegExp', 'Set', 'String', 'Symbol', 'SyntaxError', 'System', 'TypeError', 'URIError', 'WeakMap', 'WeakSet', 'Math', 'Date', 'Map', 'Set'];
        if (typeof window !== 'undefined') {
            forbNameList.push('window');
        }
        if (typeof document !== 'undefined') {
            forbNameList.push('document');
        }

        function removeArrayValues(arr) {
            var what, a = arguments, L = a.length, ax;
            while (L > 1 && arr.length) {
                what = a[--L];
                while ((ax = arr.indexOf(what)) !== -1) {
                    arr.splice(ax, 1);
                }
            }
            return arr;
        }

        this.write = function(iid, name, val, lhs, isGlobal, isPseudoGlobal) {
            /*forbNameList.map(function(forbName) {
                if (name === forbName) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                }
            });*/
            if (forbNameList.indexOf(name) >= 0) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
            }
            return {result:val};
        };

        this.endExecution = function() {
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                return new DLintWarning("WriteArgumentsVariable", iid, location, "Local variable overwrites " + forbNameList.join(' or ') + " at " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);
