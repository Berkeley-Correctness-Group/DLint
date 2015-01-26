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
 * @dlintShort{Find accesses of the 'constructor' property that do not yield the function that has created the object.}
 * @dlintLong{This may occur, e.g., if a developer forgets to set the 'constructor' field of a subclass.}
 * @dlintPattern{propRead(base,constructor,val) WHERE val \neq \mbox{function that has created}~base}
 * @dlintRule{\code{x.constructor} should yield the function that has created \code{x}.}
 * @dlintShortName{InconsistentConstructor}
 * @dlintGroup{Inheritance}
 * @dlintNeedDynamic
 * @dlintSingleEventPattern   // MP: classified as single event pattern because attaching the constructor name is an impl. detail
 */

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;

        var iidToCount = {};  // iid: number --> count: number

        var specialProp = "dlint_constructor"; // TODO: should use SMemory

        this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod) {
            if (isConstructor && typeof f.name !== 'undefined') {
                result[specialProp] = f.name;
            }
        };

        this.getField = function(iid, base, offset, val) {
            if (offset === "constructor" && typeof val !== "undefined" &&
                  typeof val.name === "string" && typeof base[specialProp] === 'string' &&
                  val.name !== base[specialProp]) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
            }
        };

        this.endExecution = function() {
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                return new DLintWarning("InconsistentConstructor", iid, location, "Reading an invalid 'constructor' at " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);
