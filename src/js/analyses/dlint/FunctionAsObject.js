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

// Author: Michael Pradel (michael@binaervarianz.de), Liang Gong (gongliang13@cs.berkeley.edu)

// NOTE: This analysis may give many false warnings. If it does, we should disable it.

/**
 * @dlintShort{Find code that uses functions as objects, i.e., code that stores properties in function objects.}
 * @dlintLong{It turns out that using functions as objects is common, so this checker results in many (false) warnings.}
 * @dlintRule{Avoid storing properties in function objects.}
 * @dlintPattern{(propRead(base,name,*) OR propWrite(base,name,*)) WHERE isFct(base) AND name \notin expectedFctProps)}
 * @dlintShortName{FunctionAsObject}
 * @dlintGroup{LanguageMisuse}
 * @dlintNeedDynamic
 * @dlintSingleEventPattern
 * @dlintObsolete
 */

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;

        var iidToCount = {}; // iid: number --> count: number
        var iidToInfo = {}; // iid: number --> info: object
        var Utils = sandbox.Utils;

        function addDebugInfo(iid, msg) {
            if (!iidToInfo[iid]) {
                iidToInfo[iid] = {};
            }
            iidToInfo[iid][msg] = (iidToInfo[iid][msg] | 0) + 1;
        }

        this.getField = function(iid, base, offset, val) {
            if (typeof base === "function" && offset !== "prototype" &&
                typeof val !== "function" &&
                offset !== "name" && offset !== "arguments" && offset !== "caller" &&
                offset !== "length" && offset !== "displayName") {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                addDebugInfo(iid, 'get field from function, offset: ' + offset);
            }
        };

        this.putField = function(iid, base, offset, val) {
            if (typeof base === "function" && offset !== "prototype" &&
                typeof val !== "function") {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                addDebugInfo(iid, 'put field to function, offset: ' + offset);
            }
        };

        this.endExecution = function() {
            //reorganize iidToInfo
            iidToInfo = Utils.reorganizeDebugInfo(iidToInfo);
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                var ret = new DLintWarning("FunctionAsObject", iid, location, "A function is used like an object at " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
                ret.debugInfo = iidToInfo[iid];
                return ret;
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);