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
 * @dlintShort{Finds calls of constructors that should not be called.}
 * @dlintLong{E.g., constructors that wrap primitives, such as Number().}
 * @dlintMayNeedDynamic
 * @dlintObsolete
 */

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;

        var iidToCountNumber = {};  // iid: number --> count: number
        var iidToCountString = {};  // iid: number --> count: number
        var iidToCountBoolean = {};  // iid: number --> count: number

        // this list is based on the following source:
        // https://jslinterrors.com/do-not-use-a-as-a-constructor
        var NumberFct = Number;
        var StringFct = String;
        var BooleanFct = Boolean;
        var JSONFct = JSON;
        var MathFct = Math;

        this.invokeFunPre = function(iid, f, base, args, isConstructor, isMethod) {
            if (isConstructor) {
                if (f === NumberFct)
                    iidToCountNumber[iid] = (iidToCountNumber[iid] | 0) + 1;
                else if (f === StringFct)
                    iidToCountString[iid] = (iidToCountString[iid] | 0) + 1;
                else if (f === BooleanFct)
                    iidToCountBoolean[iid] = (iidToCountBoolean[iid] | 0) + 1;
                else if (f === JSONFct)
                    iidToCountBoolean[iid] = (iidToCountBoolean[iid] | 0) + 1;
                else if (f === MathFct)
                    iidToCountBoolean[iid] = (iidToCountBoolean[iid] | 0) + 1;
            }
        };


        this.endExecution = function() {
            var warnings = [];
            addWarnings(warnings, iidToCountNumber, "Number");
            addWarnings(warnings, iidToCountString, "String");
            addWarnings(warnings, iidToCountBoolean, "Boolean");
            sandbox.DLint.addWarnings(warnings);
        };

        function addWarnings(warnings, iidToCount, type) {
            Object.keys(iidToCount).forEach(function(iid) {
                var location = iidToLocation(iid);
                var w = new DLintWarning("ConstructWrappedPrimitive", iid, location, "Using the " + type + " wrapper for a primitive at " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
                warnings.push(w);
            });
        }
    }
    sandbox.analysis = new MyAnalysis();
})(J$);