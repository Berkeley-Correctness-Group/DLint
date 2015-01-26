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

// Author: Koushik Sen (ksen@cs.berkeley.edu)

/**
 * @dlintShort{Find code that attempts to access the 'undefined' property.}
 * @dlintPattern{propWrite(*,"undefined",*) ORR
 * propRead(*,"undefined",*)}
 * @dlintRule{Avoid accessing the "undefined" property.}
 * @dlintShortName{UndefinedProp}
 * @dlintGroup{TypeError}
 * @dlintNeedDynamic
 * @dlintSingleEventPattern
 */

(function(sandbox) {

    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;

        var iidToCount = {};
        
        function isUnusualOffset(offset) {
            return (offset === undefined) /*|| (offset === "undefined")*/ ||
                  (offset !== offset) /*|| (offset === "NaN") */;
        }

        this.getFieldPre = function(iid, base, offset) {
            if (isUnusualOffset(offset))
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
        };

        this.putFieldPre = function(iid, base, offset, val) {
            if (isUnusualOffset(offset))
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
        };


        this.endExecution = function() {
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                var details = "Accessed property 'undefined' or 'NaN' at " + location + " " + iidToCount[iid] + " time(s).";
                return new DLintWarning("UndefinedOffset", iid, location, details, iidToCount[iid]);
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);



