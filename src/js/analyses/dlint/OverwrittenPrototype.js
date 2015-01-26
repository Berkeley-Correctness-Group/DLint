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
 * @dlintShort{Find code that overwrites in existing prototype object.}
 * @dlintLong{Instead, the code may want to extend the existing prototype.}
 * @dlintPattern{propWrite(base,name,*) WHERE name \in \{prototype, \_\_proto\_\_\} AND base.name~\mbox{is a user-defined prototype before the write}}
 * @dlintRule{Avoid overwriting an existing prototype, as it may break the assumptions of other code.}
 * @dlintShortName{OverwritePrototype}
 * @dlintGroup{Inheritance}
 * @dlintNeedDynamic
 * @dlintSingleEventPattern
 */

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;

        var iidToCount = {};  // iid: number --> count: number

        var prototypeProps = ["prototype", "__proto__"];

        function hasUserDefinedPrototype(obj) {
            if (typeof obj === "function") {
                return Object.keys(obj.prototype).length > 0;
                // Seems there's no better way for function. This approach is
                // conservative at least.
            } else if (typeof obj === "object") {
                return Object.getPrototypeOf(obj) !== Object.prototype;
            }
        }

        this.putFieldPre = function(iid, base, offset, val) {
            if (prototypeProps.indexOf(offset) !== -1 &&
                  hasUserDefinedPrototype(base)) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
            }
        };

        this.endExecution = function() {
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                return new DLintWarning("OverwrittenPrototype", iid, location, "Overwriting an existing prototype at " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);