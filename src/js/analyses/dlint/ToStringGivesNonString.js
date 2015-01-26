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
 * @dlintShort{Find calls of 'toString()' that return a non-string.}
 * @dlintLong{'toString()' should always return a string.}
 * @dlintPattern{call(*,toString,*,ret,*) WHERE !isString(ret)}
 * @dlintRule{\code{toString} must return a string.}
 * @dlintShortName{ToString}
 * @dlintGroup{TypeError}
 * @dlintNeedDynamic
 * @dlintSingleEventPattern
 */

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;

        var iidToCount = {};  // iid: number --> count: number
        var iidToInfo = {}; // iid: number --> info: object
        var Utils = sandbox.Utils;

        function addDebugInfo(iid, msg) {
            if(!iidToInfo[iid]) {
                iidToInfo[iid] = {};
            }
            iidToInfo[iid][msg] = (iidToInfo[iid][msg] | 0) + 1;
        }

        var specialProp = "dlint_function_name";  // TODO: should use SMemory

        this.getField = function(iid, base, offset, val) {
            // if a function is accessed, store its name as shadow value
            if (typeof val === "function" && !val.name) {
                val[specialProp] = offset;
            }
        };

        this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod) {
            if (f !== undefined) {
                var name = f.name ? f.name : f[specialProp];
                if (name === "toString" && isMethod &&
                      typeof result !== "string") {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'base: ' + base.constructor.name + ' .toString() return ' + result + ' (' + (typeof result) + ')');
                }
            }
        };

        this.endExecution = function() {
            //reorganize iidToInfo
            iidToInfo = Utils.reorganizeDebugInfo(iidToInfo);

            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                var ret = new DLintWarning("ToStringGivesNonString", iid, location, "A toString() method returns a non-string at " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
                ret.debugInfo = iidToInfo[iid];
                return ret;
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);