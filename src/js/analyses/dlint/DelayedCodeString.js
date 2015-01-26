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

// Author: Michael Pradel (michael@binaervarianz.de)

/**
 * @dlintShort{Find strings passed to setTimeout and setInterval.}
 * @dlintLong{Should be avoided because it causes slowdown and because some
 * platforms do not support it (most browsers do, but node.js doesn't).
 *
 * Superseded by newer checker 'DoubleEvaluation'.}
 * @dlintMayNeedDynamic
 * @obsolete
 */

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;

        var iidToCount = {};  // iid: number --> count: number

        var globalObject = typeof window === "undefined" ? global : window;

        this.invokeFunPre = function(iid, f, base, args, isConstructor, isMethod) {
            if ((f.name === "setTimeout" || f.name === "setInterval") &&
                  base === globalObject && typeof args[0] === "string") {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
            }
        };


        this.endExecution = function() {
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                return new DLintWarning("DelayedCodeString", iid, location, "A string is passed to setTimeout or setInterval at " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);
